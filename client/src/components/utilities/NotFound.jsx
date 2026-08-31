import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

//Icons
import { GoHome, GoHomeFill } from "react-icons/go";


const NotFound = () =>{
    const { ref, inView, entry} = useInView({
        threshold: 0
    });

    const revealed = "opacity-100 translate-x-0 blur-none";
    return(
        <div ref={ref} className={`off-to-side slow-trans notFound size-full col-flex-center justify-center text-white text-center ${inView&& revealed}`}>
            <h2 className="font-semibold text-2xl">Page not Found 🛑</h2>
            <Link to="/" className="group flex items-center gap-3 select-none">
                <p className="nice-trans text-xl group-hover:text-green-300">Take me home </p>
                <GoHome className="nice-trans text-2xl group-hover:text-appleBlue"/>
            </Link>
            
        </div>
    );
}

export default NotFound;