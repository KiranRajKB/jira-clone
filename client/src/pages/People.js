// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import NavigationBar from '../components/NavBar';

// const People = () => {
//   const [people, setPeople] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Define an async function to fetch people data
//     const fetchPeople = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8081/people`);
//         if (response.status !== 200) {
//           throw new Error('Failed to fetch people data');
//         }
//         const data = response.data.people;
//         setPeople(data);
//         setLoading(false);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     // Fetch people data when the component mounts
//     fetchPeople();
//   }, []);

//   return (
//     <div className="people-container">
//      <NavigationBar />
//       <h2>People</h2>
//       {loading ? (
//         <p>Loading people data...</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Username</th>
//               <th>Name</th>
//               <th>Email</th>
//             </tr>
//           </thead>
//           <tbody>
//             {people.map((person, index) => (
//               <tr key={index}>
//                 <td>{person.username}</td>
//                 <td>{person.name}</td>
//                 <td>{person.email}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default People;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavigationBar from '../components/NavBar';

const People = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPeople, setFilteredPeople] = useState([]);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get('http://localhost:8081/people');
        if (response.status === 200) {
          setPeople(response.data.people);
          setLoading(false);
        } else {
          console.error('Failed to fetch people data');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPeople();
  }, []);

  useEffect(() => {
    // Filter people when searchTerm changes
    const filtered = people.filter((person) =>
      person.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPeople(filtered);
  }, [searchTerm, people]);

  return (
    <div className="people-container">
      <NavigationBar />
      <h2>People</h2>
      <div>
        <input
          type="text"
          placeholder="Search by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading people data...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredPeople.map((person, index) => (
              <tr key={index}>
                <td>{person.username}</td>
                <td>{person.name}</td>
                <td>{person.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default People;

