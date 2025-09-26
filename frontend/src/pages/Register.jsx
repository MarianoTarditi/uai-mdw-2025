import { useState } from "react"
import { FaUser } from "react-icons/fa"

function Register() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const { name, email, password, confirmPassword } = formData;

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
                    <FaUser /> Register
                </h1>
                <p>Please create an account</p>
            </section>

            <section className="form">
                <form onSubmit={handleOnSumbit}>
                    <div className="form-group">
                        <input className="form-control" type="text" id="name" name="name" value={name} placeholder="Enter your name" onChange={handleOnChange} required />
                    </div>


                    <div className="form-group">
                        <input className="form-control" type="email" id="email" name="email" value={email} placeholder="Enter your email" onChange={handleOnChange} required />
                    </div>

                    <div className="form-group">
                        <input className="form-control" type="password" id="password" name="password" value={password} placeholder="Enter your password" onChange={handleOnChange} required />
                    </div>

                    <div className="form-group">
                        <input className="form-control" type="password" id="password2" name="confirmPassword" value={confirmPassword} placeholder="Confirm your password" onChange={handleOnChange} required />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-block" type="submit">Submit</button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Register