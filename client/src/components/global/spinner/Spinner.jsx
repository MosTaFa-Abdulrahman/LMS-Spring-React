import "./spinner.scss";
import { Loader2 } from "lucide-react";

function Spinner({ size, text }) {
  return (
    <div className="spinner">
      <Loader2 size={size} className="icon" />
      {text && <p>{text}</p>}
    </div>
  );
}

export default Spinner;
