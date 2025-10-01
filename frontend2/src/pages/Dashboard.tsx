import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../app/hooks'

function Dashboard() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { user } = useAppSelector((state) => state.auth)

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }

    }, [user, navigate, dispatch])


    return (
        <>
            <section className='heading'>
                <h1>Welcome user: {user && `${user.name}`}</h1>
                <p>Dashboard</p>
            </section>



        </>
    )
}

export default Dashboard