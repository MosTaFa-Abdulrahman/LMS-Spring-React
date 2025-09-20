import "./error.scss";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorData({
  message = "Something went wrong",
  onRetry,
  size = "medium",
  showRetry = true,
}) {
  <div className={`error error--${size}`}>
    <AlertCircle className="error__icon" />
    <h3 className="error__title">Oops!</h3>
    <p className="error__message">{message}</p>
    {showRetry && onRetry && (
      <button className="error__retry-btn" onClick={onRetry}>
        <RefreshCw className="error__retry-icon" />
        Try Again
      </button>
    )}
  </div>;
}
