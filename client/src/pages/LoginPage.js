import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Container,
  Paper,
  Avatar,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  form: {
    width: "100%",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
  },
}));

function LoginPage() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8081/login", { //change later
        username: loginData.username,
        password: loginData.password,
      });

      if (response.status === 200) {
        const { token } = response.data;

        // Store the token securely in localStorage
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("username", loginData.username);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        toast.success("Logged in successfully", { autoClose: 1000 });
        navigate("/");
      } else {
        toast.error("Login failed. Please check your credentials", {
          autoClose: 1000,
        });
        setLoginData({ username: "", password: "" });
        document.getElementsByName("username")[0].focus();
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials", {
        autoClose: 1000,
      });
      setLoginData({ username: "", password: "" });
      document.getElementsByName("username")[0].focus();
    }
  };

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography fontWeight="bold" variant="h5" align="center" className={classes.header}>
            Task Management System
          </Typography>
          <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              name="username"
              value={loginData.username}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<LockIcon />}
              style={{ marginTop: "16px" }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default LoginPage;
