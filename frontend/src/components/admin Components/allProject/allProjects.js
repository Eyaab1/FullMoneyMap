// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import './selectedProject.css';  
// import axios from 'axios';

// const allProjects = () => {
// //fetching projects
// useEffect(() => {
//     const fetchProject = async () => {
//       const token = localStorage.getItem('token'); 
//       if (!token) {
//         setError('Unauthorized access - No token found');
//         setLoading(false);
//         return;
//       }
//       try {
//         const response = await axios.get(`http://localhost:5000/api/projects/projetWithManager/${id}`, {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setProject(response.data);
//         setEditedProject(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch projects');
//         setLoading(false);
//       }
//     };

//     fetchProject();
//   }, [id]);


  
//   // Fetching managers
//   useEffect(() => {
//     const fetchManagers = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get('http://localhost:5000/api/utilisateurs/role/chef%20de%20projet', {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log('Fetched Managers:', response.data); // Log to check fetched data
//         setManagers(response.data);
//       } catch (err) {
//         console.error('Error fetching managers:', err);
//         setError('Failed to fetch managers');
//       } finally {
//         setLoading(false); // Set loading to false after the fetch attempt
//       }
//     };
//     fetchManagers();
//   }, []);

//   // Fetch freelancers associated with this project
//   useEffect(() => {
//     const fetchFreelancers = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Unauthorized access - No token found');
//         setLoading(false);
//         return;
//       }
//       try {
//         const response = await axios.get(`http://localhost:5000/api/freelancers/projects/${id}`, {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setFreelancer(response.data);
//       } catch (err) {
//         setError('Failed to fetch project freelancers');
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchFreelancers();
//   }, [id]);
  


// }
// export default allProjects;

// /*

  




// */