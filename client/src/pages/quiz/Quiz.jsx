import "./quiz.scss";
import { useContext } from "react";
import { useParams } from "react-router-dom";

// Components
import Spinner from "../../components/global/spinner/Spinner";

// Context & RTKQ
import { AuthContext } from "../../context/AuthContext";
import { useGetQuizByIdQuery } from "../../store/quizzes/quizSlice";

function Quiz() {
  const { id } = useParams();

  // Context & RTKQ
  const { currentUser: userData } = useContext(AuthContext);
  const currentUser = userData?.userInfo;
  const {
    data: quiz,
    isLoading: quizLoading,
    error: quizError,
  } = useGetQuizByIdQuery(id);

  if (quizLoading)
    return (
      <div style={{ marginTop: "25%" }}>
        <Spinner size={40} text="Loading Quiz..." />
      </div>
    );
  if (quizError) return <div className="error-message">Error loading quiz</div>;
  if (!quiz) return <div className="error-message">Quiz not found</div>;

  return <div>Quiz</div>;
}

export default Quiz;
