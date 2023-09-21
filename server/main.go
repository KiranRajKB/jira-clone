package main

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB
var jwtKey = []byte("2b0f17b3e1d4a8f9c76d092f5a17e1c3a4087a3707192623cbaf7c24cf4e1b9")
var contextKeyUsername = "username"

const TOKEN_EXPIRY_IN_MINUTES = 100
const adminUsername = "admin"
const PORT = "8081"

// const LOCALHOST = "0.0.0.0"
const LOCALHOST = ""

// const HOST = "host.docker.internal"
// const HOST = "localhost"
const HOST = "postgres"

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin"
const ADMIN_NAME = "admin"
const ADMIN_EMAIL = "admin@gmail.com"

func main() {
	initDB()

	router := gin.Default()
	router.Use(corsMiddleware())

	router.POST("/login", loginUser)

	router.Use(JWTMiddleware())

	router.POST("/create_user", checkAdminMiddleWare(), createUser)
	router.POST("/bulk_create_users", checkAdminMiddleWare(), bulkCreateUsers)
	router.DELETE("/delete_user/:username", checkAdminMiddleWare(), deleteUser)
	router.PUT("/deactivate_user/:username", checkAdminMiddleWare(), deactivateUser)
	router.PUT("/activate_user/:username", checkAdminMiddleWare(), activateUser)

	router.GET("/projects", getProjectsByUsername)
	router.GET("/people", getAllPeople)
	router.GET("/person", getPersonByUsername)
	router.PUT("/edit_profile", editProfile)

	router.GET("/can_create_project", canCreateProject)
	router.POST("/create_project", checkCreateProjectAccessMiddleWare(), createProject)

	router.GET("project/:project_id/is_project_owner", isProjectOwner)
	router.DELETE("/project/:project_id/delete_project", checkProjectOwnerMiddleWare(), deleteProject)
	router.POST("/project/:project_id/add_project_role", checkProjectOwnerMiddleWare(), AddProjectRole)
	router.POST("/project/:project_id/add_project_people", checkProjectOwnerMiddleWare(), addProjectPeople)
	router.POST("/project/:project_id/remove_project_people", checkProjectOwnerMiddleWare(), removeProjectPeople)

	router.GET("/project/:project_id/can_delete_project", CheckProjectAccessMiddleWare(), canDeleteProject)
	router.GET("/project/:project_id/details", CheckProjectAccessMiddleWare(), getProjectDetails)
	router.GET("/project/:project_id/issues", CheckProjectAccessMiddleWare(), getProjectIssues)
	router.GET("/project/:project_id/assignees", CheckProjectAccessMiddleWare(), GetAssignableUsers) // can change route
	router.GET("/project/:project_id/people", CheckProjectAccessMiddleWare(), getProjectPeople)
	router.GET("/project/:project_id/roles", CheckProjectAccessMiddleWare(), getProjectRoles)
	router.GET("/project/:project_id/role_permissions", CheckProjectAccessMiddleWare(), getRolePermissions)

	router.POST("/project/:project_id/add_issue", CheckCreateIssueAccessMiddleWare(), addIssue)
	router.POST("/project/:project_id/bulk_add_issues", CheckCreateIssueAccessMiddleWare(), bulkAddIssues)
	router.PUT("/project/:project_id/edit_issue", CheckEditIssueAccessMiddleware(), editIssue)                    // changed route (change in frontend)
	router.DELETE("/project/:project_id/delete_issue/:issue_id", CheckDeleteIssueAccessMiddleware(), deleteIssue) // changed route (change in frontend)

	router.Run(LOCALHOST + ":" + PORT)
}

func corsMiddleware() gin.HandlerFunc {
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"} // Replace with your frontend's URL
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Authorization", "Content-Type"} // Allow the Authorization and Content-Type headers

	return cors.New(config)
}

func JWTMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the JWT token from the request header
		tokenHeader := c.GetHeader("Authorization")
		if tokenHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing JWT token"})
			c.Abort()
			return
		}

		// Extract the token from the "Bearer" prefix
		tokenParts := strings.Split(tokenHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			c.Abort()
			return
		}
		tokenString := tokenParts[1]

		// Parse the JWT token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate the signing method and return the secret key
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("invalid signing method")
			}
			return jwtKey, nil
		})

		// Check for parsing errors
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "error verifying token"})
			c.Abort()
			return
		}

		// Check if the token is valid
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			// Extract the username from the token claims
			username, _ := claims["username"].(string)

			// Add the username to the request context
			ctx := context.WithValue(c.Request.Context(), contextKeyUsername, username)
			c.Request = c.Request.WithContext(ctx)
		} else if ve, ok := err.(*jwt.ValidationError); ok {
			// Check if the token has expired
			if ve.Errors&jwt.ValidationErrorExpired != 0 {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has expired"})
				c.Abort()
				return
			}
		} else {
			// If the token is not valid for other reasons, return an error
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
		}
	}
}

// checked
func checkAdminMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		username, ok := c.Request.Context().Value(contextKeyUsername).(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
			c.Abort()
			return
		}

		if username != adminUsername {
			c.JSON(http.StatusForbidden, gin.H{"error": "Only admin can perform this action"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// checked
func checkActiveUser(username string) bool {
	var isActive bool
	row := db.QueryRow("SELECT active FROM users WHERE username = $1", username)
	if err := row.Scan(&isActive); err != nil {
		return false
	}
	if !isActive {
		return false
	}
	return true
}

// checked
func checkCreateProjectAccessMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		username, ok := c.Request.Context().Value(contextKeyUsername).(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
			c.Abort()
			return
		}

		// Query the database to check if the user can create a project
		var createProject bool
		err := db.QueryRow("SELECT can_create_project FROM Users WHERE username = $1", username).Scan(&createProject)
		if err != nil {
			fmt.Println("Database query error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query error"})
			c.Abort()
			return
		}

		if !createProject {
			c.JSON(http.StatusForbidden, gin.H{"error": "User does not have permission to create projects"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// checked (must check in frontend)
func CheckProjectAccessMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		projectID := c.Param("project_id")
		username, ok := c.Request.Context().Value(contextKeyUsername).(string)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized access"})
			c.Abort()
			return
		}

		query := "SELECT count(*) FROM project_user_role WHERE project_id = $1 AND username = $2"
		var result int
		err := db.QueryRow(query, projectID, username).Scan(&result)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
			c.Abort()
			return
		}

		if result == 0 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized access"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// checked (must check in frontend)
func checkProjectOwnerMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		username, ok := c.Request.Context().Value(contextKeyUsername).(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
			return
		}

		projectID := c.Param("project_id")

		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM project_user_role WHERE project_id = $1 AND role_name = 'Owner' AND username = $2)", projectID, username).Scan(&exists)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify permission"})
			c.Abort()
			return
		}

		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Only project owner has access"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// checked
func CheckCreateIssueAccessMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		projectID := c.Param("project_id")
		username, ok := c.Request.Context().Value(contextKeyUsername).(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
			c.Abort()
			return
		}

		permissions, err := getRolePermissionsHelper(projectID, username)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch permissions"})
			c.Abort()
			return
		}

		if !permissions.CreateIssue {
			c.JSON(http.StatusForbidden, gin.H{"error": "Permission denied"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// checked
func CheckEditIssueAccessMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		projectID := c.Param("project_id")
		username, ok := c.Request.Context().Value(contextKeyUsername).(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
			c.Abort()
			return
		}

		permissions, err := getRolePermissionsHelper(projectID, username)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch permissions"})
			c.Abort()
			return
		}

		if !permissions.EditIssue {
			c.JSON(http.StatusForbidden, gin.H{"error": "Permission denied"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// checked
func CheckDeleteIssueAccessMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		projectID := c.Param("project_id")
		username, ok := c.Request.Context().Value(contextKeyUsername).(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
			c.Abort()
			return
		}

		permissions, err := getRolePermissionsHelper(projectID, username)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch permissions"})
			c.Abort()
			return
		}

		if !permissions.DeleteIssue {
			c.JSON(http.StatusForbidden, gin.H{"error": "Permission denied"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// checked
func deleteUser(c *gin.Context) {
	username := c.Param("username")
	if username == "admin" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete admin"})
		return
	}

	_, err := db.Exec("DELETE FROM users WHERE username=$1", username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// checked
func deactivateUser(c *gin.Context) {
	username := c.Param("username")
	if username == "admin" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot deactivate admin"})
		return
	}

	_, err := db.Exec("UPDATE users SET active = FALSE WHERE username=$1", username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to deactivate user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deactivated successfully"})
}

// checked
func activateUser(c *gin.Context) {
	username := c.Param("username")
	_, err := db.Exec("UPDATE users SET active = TRUE WHERE username=$1", username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to activate user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User activated successfully"})
}

// checked (returns all project users + bool (whether permission is present), filter in frontend)
func GetAssignableUsers(c *gin.Context) {
	projectID := c.Param("project_id")

	type AssignableUser struct {
		Username   string `json:"username"`
		Assignable bool   `json:"assignable"`
	}

	query := `
	SELECT pur.username, r.assignable
	FROM project_user_role pur
	JOIN roles r ON pur.project_id = r.project_id AND pur.role_name = r.role_name
	JOIN users u ON u.username = pur.username
	WHERE pur.project_id = $1 and u.active = true
	`

	rows, err := db.Query(query, projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch assignable users"})
		return
	}
	defer rows.Close()

	var assignableUsers []AssignableUser
	for rows.Next() {
		var assignableUser AssignableUser
		if err := rows.Scan(&assignableUser.Username, &assignableUser.Assignable); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning database rows"})
			return
		}
		assignableUsers = append(assignableUsers, assignableUser)
	}

	c.JSON(http.StatusOK, gin.H{"assignees": assignableUsers})
}

// checked
func addProjectPeople(c *gin.Context) {
	type AddProjectPeopleForm struct {
		PersonUsername string `form:"person_username" binding:"required"`
		PersonRole     string `form:"person_role" binding:"required"`
	}
	projectID := c.Param("project_id")

	var formData AddProjectPeopleForm
	if err := c.ShouldBind(&formData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "input data did not match the expected format"})
		return
	}

	insertQuery := "INSERT INTO project_user_role (project_id, role_name, username) VALUES ($1, $2, $3)"
	_, insertErr := db.Exec(insertQuery, projectID, formData.PersonRole, formData.PersonUsername)
	if insertErr != nil {
		fmt.Println("error : ", insertErr)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error adding people to project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Person added to project with role"})
}

// checked
func removeProjectPeople(c *gin.Context) {
	projectID := c.Param("project_id")

	var request struct {
		Username string `json:"username"`
	}

	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "input data did not match expected format"})
		return
	}

	if request.Username == adminUsername {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot remove admin"})
		return
	}

	deleteQuery := "DELETE FROM project_user_role WHERE project_id = $1 AND username = $2"
	_, deleteErr := db.Exec(deleteQuery, projectID, request.Username)
	if deleteErr != nil {
		fmt.Println("error: ", deleteErr)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove user from project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User removed from project"})
}

// checked
func isProjectOwner(c *gin.Context) {
	projectID := c.Param("project_id")

	username, ok := c.Request.Context().Value(contextKeyUsername).(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
		return
	}

	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM project_user_role WHERE project_id = $1 AND role_name = 'Owner' AND username = $2)", projectID, username).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"isProjectOwner": exists})
}

// checked
func AddProjectRole(c *gin.Context) {
	projectID := c.Param("project_id")

	type Role struct {
		RoleName        string `json:"role_name" binding:"required"`
		CreateIssue     bool   `json:"create_issue"`
		EditIssue       bool   `json:"edit_issue"`
		TransitionIssue bool   `json:"transition_issue"`
		CloseIssue      bool   `json:"close_issue"`
		DeleteIssue     bool   `json:"delete_issue"`
		Assignable      bool   `json:"assignable"`
	}

	var role Role
	if err := c.ShouldBindJSON(&role); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "input data did not match expected"})
		return
	}
	fmt.Println(role)
	// Insert the role information into the Roles table
	insertQuery := `
        INSERT INTO Roles (role_name, project_id, create_issue, edit_issue, transition_issue, close_issue, delete_issue, assignable)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `
	_, err := db.Exec(
		insertQuery,
		role.RoleName,
		projectID,
		role.CreateIssue,
		role.EditIssue,
		role.TransitionIssue,
		role.CloseIssue,
		role.DeleteIssue,
		role.Assignable,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Role added successfully"})
}

// checked
func canCreateProject(c *gin.Context) {
	username, ok := c.Request.Context().Value(contextKeyUsername).(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
		return
	}

	var canCreateProject bool
	query := "SELECT can_create_project FROM users WHERE username = $1"
	err := db.QueryRow(query, username).Scan(&canCreateProject)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"canCreateProject": canCreateProject})
}

// checked
func editProfile(c *gin.Context) {
	username, ok := c.Request.Context().Value(contextKeyUsername).(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
		return
	}

	type ProfileUpdate struct {
		Username string `json:"username"`
		Name     string `json:"name"`
		Email    string `json:"email"`
	}

	// Parse the request body into the ProfileUpdate struct
	var updateData ProfileUpdate
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "input data did not match expected format"})
		return
	}

	if username != updateData.Username {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Provided username does not match with the current user"})
	}

	updateQuery := `
	    UPDATE users
	    SET name = $1, email = $2
	    WHERE username = $3
	`
	_, err := db.Exec(updateQuery, updateData.Name, updateData.Email, username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}

// checked
func deleteIssue(c *gin.Context) {
	issueID := c.Param("issue_id")

	deleteQuery := `
		DELETE FROM issues
		WHERE issue_id = $1
	`
	_, err := db.Exec(deleteQuery, issueID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "input data did not match expected format"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Issue deleted successfully"})
}

// checked
func getRolePermissions(c *gin.Context) {
	projectID := c.Param("project_id")
	username, ok := c.Request.Context().Value(contextKeyUsername).(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
		return
	}

	query := `
    SELECT r.create_issue, r.edit_issue, r.transition_issue, r.close_issue, r.delete_issue
    FROM project_user_role pur
    INNER JOIN roles r ON pur.project_id = r.project_id AND pur.role_name = r.role_name
    WHERE pur.project_id = $1 AND pur.username = $2
    `

	var permissions struct {
		CreateIssue     bool `json:"create_issue"`
		EditIssue       bool `json:"edit_issue"`
		TransitionIssue bool `json:"transition_issue"`
		CloseIssue      bool `json:"close_issue"`
		DeleteIssue     bool `json:"delete_issue"`
	}

	err := db.QueryRow(query, projectID, username).Scan(
		&permissions.CreateIssue,
		&permissions.EditIssue,
		&permissions.TransitionIssue,
		&permissions.CloseIssue,
		&permissions.DeleteIssue,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "User or role not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch permissions"})
		}
		return
	}

	c.JSON(http.StatusOK, permissions)
}

// must check (add transaction)
func addIssue(c *gin.Context) {
	projectID := c.Param("project_id")
	type Issue struct {
		IssueID     string   `json:"issue_id"`
		ReportedBy  string   `json:"reported_by"`
		Summary     string   `json:"summary"`
		Description string   `json:"description"`
		Assignee    string   `json:"assignee"`
		Status      string   `json:"status"`
		Tags        []string `json:"tags"`
	}

	var newIssue Issue
	if err := c.ShouldBindJSON(&newIssue); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "input data did not match expected format"})
		return
	}

	// Check if assignee has asignable permission
	permissions, err := getRolePermissionsHelper(projectID, newIssue.Assignee)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	if !permissions.Assignable {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Assignee does not have assignable permission"})
		return
	}

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Insert the new issue into the database along with the provided issueID
	insertIssueQuery := `
		INSERT INTO issues (issue_id, project_id, reported_by, summary, description, assignee, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`
	_, err = db.Exec(
		insertIssueQuery,
		newIssue.IssueID,
		projectID,
		newIssue.ReportedBy,
		newIssue.Summary,
		newIssue.Description,
		newIssue.Assignee,
		newIssue.Status,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	// Insert tags for the new issue
	insertTagsQuery := `
		INSERT INTO issue_tags (issue_id, tag)
		VALUES ($1, $2)
	`
	for _, tag := range newIssue.Tags {
		_, err = db.Exec(insertTagsQuery, newIssue.IssueID, tag)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Issue created successfully"})
}

// checked
func bulkAddIssues(c *gin.Context) {
	projectID := c.Param("project_id")

	type Issue struct {
		IssueID     string   `json:"IssueID"`
		ReportedBy  string   `json:"ReportedBy"`
		Summary     string   `json:"Summary"`
		Description string   `json:"Description"`
		Assignee    string   `json:"Assignee"`
		Status      string   `json:"Status"`
		Tags        []string `json:"Tags"`
	}

	type BulkIssueRequest struct {
		Issues []Issue `json:"issues"`
	}

	var bulkRequest BulkIssueRequest
	if err := c.ShouldBindJSON(&bulkRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "input data did not match expected format"})
		return
	}

	// Start a database transaction
	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	defer tx.Rollback() // Rollback the transaction if any error occurs

	insertIssueQuery := `
        INSERT INTO issues (issue_id, project_id, reported_by, summary, description, assignee, status)
        VALUES
    `
	var issueValues []interface{}
	issuePlaceholders := make([]string, 0)

	for _, issue := range bulkRequest.Issues {
		issueValues = append(issueValues, issue.IssueID, projectID, issue.ReportedBy, issue.Summary, issue.Description, issue.Assignee, issue.Status)
		issuePlaceholders = append(issuePlaceholders, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d, $%d)", len(issueValues)-6, len(issueValues)-5, len(issueValues)-4, len(issueValues)-3, len(issueValues)-2, len(issueValues)-1, len(issueValues)))
	}

	insertIssueQuery += strings.Join(issuePlaceholders, ", ")
	fmt.Println(insertIssueQuery)
	fmt.Println(issueValues)
	_, err = tx.Exec(insertIssueQuery, issueValues...)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	// Prepare the INSERT INTO issue_tags query with multiple value sets
	insertTagsQuery := `
			INSERT INTO issue_tags (issue_id, tag)
			VALUES
			`

	// Store values and placeholders for the tags query
	var tagValues []interface{}
	tagPlaceholders := make([]string, 0)

	// Initialize a counter for placeholders
	placeholderCounter := 1

	// Iterate through the issues and tags to add them to the query
	for _, issue := range bulkRequest.Issues {
		for _, tag := range issue.Tags {
			tagValues = append(tagValues, issue.IssueID, tag)
			tagPlaceholders = append(tagPlaceholders, fmt.Sprintf("($%d, $%d)", placeholderCounter, placeholderCounter+1))
			placeholderCounter += 2
		}
	}

	// Combine the placeholders into the tags query
	insertTagsQuery += strings.Join(tagPlaceholders, ", ")

	_, err = tx.Exec(insertTagsQuery, tagValues...)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Issues created successfully"})
}

// must check (must check middleware and frontend)
func editIssue(c *gin.Context) {
	projectID := c.Param("project_id")
	username, ok := c.Request.Context().Value(contextKeyUsername).(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
		return
	}

	type Issue struct {
		IssueID string `json:"issue_id"`
		// ProjectID   string   `json:"project_id"`
		// ReportedBy  string   `json:"reported_by"`
		Summary     string   `json:"summary"`
		Description string   `json:"description"`
		Assignee    string   `json:"assignee"`
		Status      string   `json:"status"`
		Tags        []string `json:"tags"`
	}

	var updatedIssue Issue
	if err := c.ShouldBindJSON(&updatedIssue); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "input data did not match expected format"})
		return
	}

	permissions, err := getRolePermissionsHelper(projectID, updatedIssue.Assignee)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	if !permissions.Assignable {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Assignee does not have assignable permission"})
		return
	}

	query := `
		SELECT status
		FROM issues
		WHERE issue_id = $1
	`
	row := db.QueryRow(query, updatedIssue.IssueID)

	var oldStatus string

	if err := row.Scan(&oldStatus); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Issue not found"})
		return
	}

	if oldStatus != updatedIssue.Status {
		permissions, err := getRolePermissionsHelper(projectID, username)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch permissions"})
			return
		}

		if updatedIssue.Status == "closed" {
			if !permissions.CloseIssue {
				c.JSON(http.StatusForbidden, gin.H{"error": "User does not have close issue permission"})
				return
			}
		} else if !permissions.TransitionIssue {
			c.JSON(http.StatusForbidden, gin.H{"error": "User does not have transition issue permission"})
			return
		}
	}

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	updateQuery := `
		UPDATE issues
		SET summary = $1, description = $2, assignee = $3, status = $4
		WHERE issue_id = $5
	`
	_, err = db.Exec(updateQuery, updatedIssue.Summary, updatedIssue.Description, updatedIssue.Assignee, updatedIssue.Status, updatedIssue.IssueID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	deleteTagsQuery := `
		DELETE FROM issue_tags
		WHERE issue_id = $1
	`
	_, err = db.Exec(deleteTagsQuery, updatedIssue.IssueID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	insertTagsQuery := `
		INSERT INTO issue_tags (issue_id, tag)
		VALUES ($1, $2)
	`
	for _, tag := range updatedIssue.Tags {
		_, err = db.Exec(insertTagsQuery, updatedIssue.IssueID, tag)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Issue updated successfully"})
}

// checked
func getProjectIssues(c *gin.Context) {
	projectID := c.Param("project_id")

	type Issue struct {
		IssueID     string   `json:"issue_id"`
		ReportedBy  string   `json:"reported_by"`
		Summary     string   `json:"summary"`
		Description string   `json:"description"`
		Assignee    string   `json:"assignee"`
		Status      string   `json:"status"`
		Tags        []string `json:"tags"`
	}

	type Tag struct {
		IssueID string `json:"issue_id"`
		Tag     string `json:"tag"`
	}

	// Query for issues
	issueQuery := `
        SELECT issue_id, reported_by, summary, description, assignee, status
        FROM issues
        WHERE project_id = $1
    `

	// Query for tags
	tagQuery := `
        SELECT issue_id, tag
        FROM issue_tags
        WHERE issue_id IN (SELECT issue_id FROM issues WHERE project_id = $1)
    `

	var issues []Issue
	rows, err := db.Query(issueQuery, projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch issues"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var issue Issue
		if err := rows.Scan(&issue.IssueID, &issue.ReportedBy, &issue.Summary, &issue.Description, &issue.Assignee, &issue.Status); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning database rows"})
			return
		}
		issues = append(issues, issue)
	}

	var tags []Tag
	rows, err = db.Query(tagQuery, projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tags"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var tag Tag
		if err := rows.Scan(&tag.IssueID, &tag.Tag); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning database rows"})
			return
		}
		tags = append(tags, tag)
	}

	// Group tags by issue_id
	tagMap := make(map[string][]string)
	for _, tag := range tags {
		tagMap[tag.IssueID] = append(tagMap[tag.IssueID], tag.Tag)
	}

	// Combine issues and tags
	var issuesWithTags []Issue
	for _, issue := range issues {
		issueTags := tagMap[issue.IssueID]
		issuesWithTags = append(issuesWithTags, Issue{
			IssueID:     issue.IssueID,
			ReportedBy:  issue.ReportedBy,
			Summary:     issue.Summary,
			Description: issue.Description,
			Assignee:    issue.Assignee,
			Status:      issue.Status,
			Tags:        issueTags,
		})
	}

	c.JSON(http.StatusOK, gin.H{"issues": issuesWithTags})
}

// checked, must check in frontend (modified to all owners)
func canDeleteProject(c *gin.Context) {
	projectID := c.Param("project_id")

	username, ok := c.Request.Context().Value(contextKeyUsername).(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
		return
	}

	query := "SELECT role_name FROM project_user_role WHERE project_id = $1 and username = $2"
	var rolename string
	if err := db.QueryRow(query, projectID, username).Scan(&rolename); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	canDelete := rolename == "Owner"
	c.JSON(http.StatusOK, gin.H{"can_delete_project": canDelete})
}

// checked, must check in frontend (also returning can_create_project)
func getPersonByUsername(c *gin.Context) {
	username, ok := c.Request.Context().Value(contextKeyUsername).(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
		return
	}

	query := `
        SELECT username, name, email, can_create_project
        FROM users
        WHERE username = $1
    `
	row := db.QueryRow(query, username)

	var (
		foundUsername    string
		name             string
		email            string
		canCreateProject bool
	)

	// Scan the result row
	if err := row.Scan(&foundUsername, &name, &email, &canCreateProject); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Person not found"})
		return
	}

	// Create a response JSON object
	person := gin.H{
		"username":         foundUsername,
		"name":             name,
		"email":            email,
		"canCreateProject": canCreateProject,
	}

	c.JSON(http.StatusOK, gin.H{"person": person})
}

// checked
func getAllPeople(c *gin.Context) {
	currentUsername, ok := c.Request.Context().Value(contextKeyUsername).(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
		return
	}
	query := `
	SELECT username, name, email, can_create_project, active
	FROM users
	`
	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	defer rows.Close()

	var people []gin.H

	for rows.Next() {
		var (
			username         string
			name             string
			email            string
			canCreateProject bool
			active           bool
		)
		if err := rows.Scan(&username, &name, &email, &canCreateProject, &active); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning database rows"})
			return
		}
		if currentUsername == "admin" {
			person := gin.H{
				"username":         username,
				"name":             name,
				"email":            email,
				"active":           active,
				"canCreateProject": canCreateProject,
			}
			people = append(people, person)
		} else if active {
			person := gin.H{
				"username": username,
				"name":     name,
				"email":    email,
				"active":   true,
			}
			people = append(people, person)
		}
	}

	c.JSON(http.StatusOK, gin.H{"people": people})
}

// checked, must check in frontend
func getProjectPeople(c *gin.Context) {
	projectID := c.Param("project_id")

	query := `
		SELECT u.username, u.name, u.email, pur.role_name
		FROM users u
		JOIN project_user_role pur ON u.username = pur.username
		WHERE pur.project_id = $1 and u.active
	`
	rows, err := db.Query(query, projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	defer rows.Close()

	var people []gin.H

	for rows.Next() {
		var (
			username string
			name     string
			email    string
			roleName string
		)
		if err := rows.Scan(&username, &name, &email, &roleName); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning database rows"})
			return
		}

		person := gin.H{
			"username":  username,
			"name":      name,
			"email":     email,
			"role_name": roleName,
		}
		people = append(people, person)
	}

	c.JSON(http.StatusOK, gin.H{"people": people})
}

func TransitionIssue(c *gin.Context) { //delete
	// Extract the issue_id and status from the request JSON
	var request struct {
		IssueID string `json:"issue_id"`
		Status  string `json:"status"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Extract the username from the request context (assuming you have JWT middleware)
	username, ok := c.Request.Context().Value(contextKeyUsername).(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
		return
	}

	// Check if the user has permission to transition issues
	var transitionIssuePermission bool
	err := db.QueryRow(`
        SELECT r.transition_issue
        FROM project_user_role pur
        INNER JOIN Roles r ON pur.role_name = r.role_name AND pur.project_id = r.project_id
        WHERE pur.username = $1 AND pur.project_id = 
		(SELECT project_id FROM issues WHERE issue_id = $2)
    `, username, request.IssueID).Scan(&transitionIssuePermission)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check permissions"})
		return
	}

	// Check if the user has permission to transition issues and if the status is not 'closed'
	if transitionIssuePermission && request.Status != "closed" {
		_, err := db.Exec("UPDATE issues SET status = $1 WHERE issue_id = $2", request.Status, request.IssueID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update issue status"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Issue status updated successfully"})
	} else {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to transition this issue"})
	}
}

func deleteProject(c *gin.Context) { // checked
	projectID := c.Param("project_id")

	_, err := db.Exec("DELETE FROM projects WHERE project_id = $1", projectID)
	if err != nil {
		fmt.Println("Error : ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}

func getProjectRoles(c *gin.Context) { // checked
	projectID := c.Param("project_id")
	query := `
	SELECT role_name, create_issue, edit_issue, transition_issue, close_issue, delete_issue, assignable
	FROM roles
	WHERE project_id = $1
`
	rows, err := db.Query(query, projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	defer rows.Close()

	var roles []gin.H

	for rows.Next() {
		var (
			roleName        string
			createIssue     bool
			editIssue       bool
			transitionIssue bool
			closeIssue      bool
			deleteIssue     bool
			assignable      bool
		)
		if err := rows.Scan(&roleName, &createIssue, &editIssue, &transitionIssue, &closeIssue, &deleteIssue, &assignable); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning database rows"})
			return
		}

		role := gin.H{
			"role_name":        roleName,
			"create_issue":     createIssue,
			"edit_issue":       editIssue,
			"transition_issue": transitionIssue,
			"close_issue":      closeIssue,
			"delete_issue":     deleteIssue,
			"assignable":       assignable,
		}
		roles = append(roles, role)
	}

	c.JSON(http.StatusOK, gin.H{"roles": roles})
}

func getProjectDetails(c *gin.Context) { //checked
	projectID := c.Param("project_id")

	query := "SELECT project_name, description, owner_username FROM projects WHERE project_id = $1"
	var (
		projectName   string
		description   string
		ownerUsername string
	)
	err := db.QueryRow(query, projectID).Scan(&projectName, &description, &ownerUsername)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"project_id":     projectID,
		"project_name":   projectName,
		"description":    description,
		"owner_username": ownerUsername,
	})
}

func CreateIssue(c *gin.Context) { //delete
	reportedBy, ok := c.Request.Context().Value(contextKeyUsername).(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve reported_by from context"})
		return
	}

	var issue struct {
		ProjectID   string `json:"project_id"`
		Summary     string `json:"summary"`
		Description string `json:"description"`
		Assignee    string `json:"assignee"`
		Status      string `json:"status"`
	}
	if err := c.ShouldBindJSON(&issue); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Check permissions for reported_by
	var createIssuePermission bool
	err := db.QueryRow(`
        SELECT p.create_issue
        FROM project_user_role pur
        INNER JOIN Roles r ON pur.role_name = r.role_name AND pur.project_id = r.project_id
        INNER JOIN projects p ON r.project_id = p.id
        WHERE pur.username = $1 AND r.project_id = $2
    `, reportedBy, issue.ProjectID).Scan(&createIssuePermission)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check permissions"})
		return
	}

	if !createIssuePermission {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to create an issue"})
		return
	}

	var assignablePermission bool
	err = db.QueryRow(`
	SELECT assignable
	FROM roles
	WHERE project_id = $1 AND
	role_name = (SELECT role_name FROM project_user_role WHERE project_id = $1 AND username = $2)
`, issue.ProjectID, issue.Assignee).Scan(&assignablePermission)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check permissions"})
		return
	}

	if !createIssuePermission {
		c.JSON(http.StatusForbidden, gin.H{"error": "Assignee doesn't have assignable permission"})
		return
	}

	// Insert the issue into the 'issues' table
	_, err = db.Exec(`
        INSERT INTO issues (project_id, reported_by, summary, description, assignee, status)
        VALUES ($1, $2, $3, $4, $5, $6)
    `, issue.ProjectID, reportedBy, issue.Summary, issue.Description, issue.Assignee, issue.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create the issue"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Issue created successfully"})
}

func createProject(c *gin.Context) { // checked
	var project struct {
		ProjectID     string `json:"projectID"`
		ProjectName   string `json:"projectName"`
		Description   string `json:"description"`
		OwnerUsername string `json:"projectLead"`
	}
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	ownerUsername, _ := c.Request.Context().Value(contextKeyUsername).(string)

	if ownerUsername != project.OwnerUsername {
		c.JSON(http.StatusForbidden, gin.H{"error": "Provided username does not match with the current user"})
		return
	}

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			panic(r)
		}
	}()

	_, err = tx.Exec(
		"INSERT INTO projects (project_id, project_name, description, owner_username) VALUES ($1, $2, $3, $4)",
		project.ProjectID, project.ProjectName, project.Description, ownerUsername,
	)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	insertQuery := `
        INSERT INTO Roles (role_name, project_id, create_issue, edit_issue, transition_issue, close_issue, delete_issue, assignable)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `
	_, err = tx.Exec(
		insertQuery,
		"Owner",
		project.ProjectID,
		true,
		true,
		true,
		true,
		true,
		true,
	)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	insertQuery = "INSERT INTO project_user_role (project_id, role_name, username) VALUES ($1, $2, $3)"

	_, err = tx.Exec(insertQuery, project.ProjectID, "Owner", adminUsername)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	if ownerUsername != adminUsername {
		_, err = tx.Exec(insertQuery, project.ProjectID, "Owner", ownerUsername)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Project added successfully"})
}

func getProjectsByUsername(c *gin.Context) { //checked
	username, ok := c.Request.Context().Value(contextKeyUsername).(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve username from context"})
		return
	}

	query := `
        SELECT p.project_id, p.project_name, p.description, p.owner_username
        FROM projects p
        JOIN project_user_role pur ON p.project_id = pur.project_id
        WHERE pur.username = $1
    `
	rows, err := db.Query(query, username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	defer rows.Close()

	var projects []gin.H

	for rows.Next() {
		var (
			project_id     string
			project_name   string
			description    string
			owner_username string
		)
		if err := rows.Scan(&project_id, &project_name, &description, &owner_username); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning database rows"})
			return
		}

		project := gin.H{
			"project_id":     project_id,
			"project_name":   project_name,
			"description":    description,
			"owner_username": owner_username,
		}
		projects = append(projects, project)
	}

	c.JSON(http.StatusOK, gin.H{"projects": projects})
}

func initDB() { // checked
	connStr := "host=" + HOST + " port=5432 user=postgres password=kiran dbname=postgres sslmode=disable"
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}
	fmt.Println("Connected to the database")

	createAdmin()
}

func createAdmin() bool {
	hashedPassword, err := hashPassword(ADMIN_PASSWORD)
	if err != nil {
		return false
	}

	// Insert admin into the database
	_, err = db.Exec("INSERT INTO users (username, password, name, email, can_create_project) VALUES ($1, $2, $3, $4, $5)",
		ADMIN_USERNAME, hashedPassword, ADMIN_NAME, ADMIN_EMAIL, true)
	if err != nil {
		return false
	}

	return true
}

func createUser(c *gin.Context) { // checked
	type User struct {
		Username         string `json:"username"`
		Password         string `json:"password"`
		Name             string `json:"name"`
		Email            string `json:"email"`
		CanCreateProject bool   `json:"canCreateProject"`
	}

	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "input data did not match expected format"})
		return
	}

	// Check if the username already exists in the database
	exists, err := isUsernameExists(user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	// Hash the user's password before storing it in the database
	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Password hashing error"})
		return
	}

	// Insert the new user into the database
	_, err = db.Exec("INSERT INTO users (username, password, name, email, can_create_project) VALUES ($1, $2, $3, $4, $5)",
		user.Username, hashedPassword, user.Name, user.Email, user.CanCreateProject)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

func bulkCreateUsers(c *gin.Context) { // checked
	type User struct {
		Username         string `json:"username"`
		Password         string `json:"password"`
		Name             string `json:"name"`
		Email            string `json:"email"`
		CanCreateProject bool   `json:"canCreateProject"`
	}

	type BulkUserRequest struct {
		Users []User `json:"users"`
	}

	var bulkRequest BulkUserRequest
	if err := c.ShouldBindJSON(&bulkRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "input data did not match expected format"})
		return
	}

	// Start a database transaction
	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	defer tx.Rollback() // Rollback the transaction if any error occurs

	insertUserQuery := `
        INSERT INTO users (username, password, name, email, can_create_project)
        VALUES
    `
	var userValues []interface{}
	userPlaceholders := make([]string, 0)

	for _, user := range bulkRequest.Users {
		hashedPassword, err := hashPassword(user.Password)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Password hashing error"})
			return
		}

		userValues = append(userValues, user.Username, hashedPassword, user.Name, user.Email, user.CanCreateProject)
		userPlaceholders = append(userPlaceholders, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d)", len(userValues)-4, len(userValues)-3, len(userValues)-2, len(userValues)-1, len(userValues)))
	}

	insertUserQuery += strings.Join(userPlaceholders, ", ")
	_, err = tx.Exec(insertUserQuery, userValues...)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Users created successfully"})
}

func loginUser(c *gin.Context) { // checked
	var user struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "input data did not match expected format"})
		return
	}

	if !isValidUser(user.Username, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if !checkActiveUser(user.Username) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User deactivated"})
		return
	}

	token, err := generateJWTToken(user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "JWT token generation error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "message": "Login successful"})
}

// checked, must check in frontend
func getRolePermissionsHelper(projectID, username string) (permissions struct {
	CreateIssue     bool `json:"create_issue"`
	EditIssue       bool `json:"edit_issue"`
	TransitionIssue bool `json:"transition_issue"`
	CloseIssue      bool `json:"close_issue"`
	DeleteIssue     bool `json:"delete_issue"`
	Assignable      bool `json:"assignable"`
}, err error) {
	query := `
    SELECT r.create_issue, r.edit_issue, r.transition_issue, r.close_issue, r.delete_issue, r.assignable
    FROM project_user_role pur
    INNER JOIN roles r ON pur.project_id = r.project_id AND pur.role_name = r.role_name
    WHERE pur.project_id = $1 AND pur.username = $2
    `

	err = db.QueryRow(query, projectID, username).Scan(
		&permissions.CreateIssue,
		&permissions.EditIssue,
		&permissions.TransitionIssue,
		&permissions.CloseIssue,
		&permissions.DeleteIssue,
		&permissions.Assignable,
	)

	return permissions, err
}

func isValidUser(username, password string) bool { //checked
	var storedPassword string

	row := db.QueryRow("SELECT password FROM users WHERE username = $1", username)
	if err := row.Scan(&storedPassword); err != nil {
		return false
	}

	// return storedPassword == password // change later
	if err := bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(password)); err != nil {
		return false
	}
	return true
}

func isUsernameExists(username string) (bool, error) { //checked
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM users WHERE username = $1", username).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// password <= 72 bytes
func hashPassword(password string) (string, error) { //checked
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func generateJWTToken(username string) (string, error) { //checked
	// Define the token claims (payload)
	claims := jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(time.Minute * TOKEN_EXPIRY_IN_MINUTES).Unix(),
		"iat":      time.Now().Unix(),
	}

	// Create the token using the claims and sign it with the secret key
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
