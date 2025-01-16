import React from "react";
import useAuthentication from "../../hooks/useAuthentication";
import LoadingModal from "../Modal/LoadingModal";
import { useNavigate } from "react-router-dom";

export const Login = () => {

    const { login } = useAuthentication();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    const submitLogin = async (username, password) => {
        try {
            setLoading(true);
            const token = await login(username, password);
            const data = JSON.parse(atob(token.split('.')[1]));
            window.localStorage.setItem('nxtgen.token', token);
            window.localStorage.setItem('nxtgen.isLoggedIn', 'true');
            window.localStorage.setItem('nxtgen.access', data.access);
            navigate('/dashboard');
            setLoading(false);
        } catch (error) {
            setError(error.message);
            console.error(error);
            setLoading(false);
        }
    }

  return (
        <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                        Sign in to your account
                    </h1>
                    <form className="space-y-4 md:space-y-6"  onSubmit={(e) => {
                            e.preventDefault()
                            submitLogin(e.target.email.value, e.target.password.value)
                        }}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="name@email.com" required="" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 " required="" />
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <button type="submit" className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Sign in</button>
                    </form>
                </div>
            </div>
        </div>
        {loading && <LoadingModal />}
        </section>
  )
}