import { FaSignInAlt } from "react-icons/fa"
import { useState } from "react"

function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    const handleOnChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const handleOnSumbit = (e) => {
        e.preventDefault()
    }

    return (
        <>
            <section className="heading">
                <h1>
                    <FaSignInAlt /> Login
                </h1>
                <p>Please Login in your account</p>
            </section>

            <section className="form">
                <form onSubmit={handleOnSumbit}>
                    <div className="form-group">
                        <input className="form-control" type="email" id="email" name="email" value={email} placeholder="Enter your email" onChange={handleOnChange} required />
                    </div>

                    <div className="form-group">
                        <input className="form-control" type="password" id="password" name="password" value={password} placeholder="Enter your password" onChange={handleOnChange} required />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-block" type="submit">Submit</button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Login