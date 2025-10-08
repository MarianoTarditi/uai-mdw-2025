import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate, dispatch]);

  return (
    <>
      <div className="container">
        <section className="heading">
          <h1>Welcome user: {user && `${user.name}`}</h1>
          <p>Dashboard</p>
        </section>
      </div>
    </>
  );
}

export default Home;
