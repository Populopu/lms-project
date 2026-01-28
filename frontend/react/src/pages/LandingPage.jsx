import { useNavigate } from "react-router-dom";
import "../styles/landingPage.css"

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Welcome to LMS</h1>
      <p>Manage students, courses and learning in one place</p>

      <button onClick={() => navigate("/signup")}>
        Get Started (Teacher Signup)
      </button>
    </div>
  );
}
