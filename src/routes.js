import React from "react";

/*-- Import required components --*/
const HomePage = React.lazy(() => import("./components/pages/home/HomePage"));
const Students = React.lazy(() => import("./components/pages/students/Students"));
const StudentReservations = React.lazy(() => import("./components/pages/students/StudentReservations"));
const PromoCampaign = React.lazy(() => import("./components/pages/campaign/PromoCampaigns"));

const routes = [    
    { path: "/home", name: "Home Page", icon: "fa fa-home", component: HomePage }, 
    { path: "/students", name: "Students Registration", icon: "fa fa-star", component: Students },
    { path: "/studentReservations", name: "Students Reservations", icon: "fa fa-star", component: StudentReservations },
    { path: "/promoCampaigns", name: "Promotion Campaign", icon: "fa fa-star", component: PromoCampaign },
];
export default routes;

