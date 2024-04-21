import './styles.css'
import SearchIcon from '../../assets/images/search.png'
import Hamburger from '../../assets/images/hamburger.png'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { clear } from '../../utils/storage'
import { useDispatch } from 'react-redux'
import { Logout } from '../../redux/actions'

const Header = ({ title, setVisible, visible }) => {
    const [value, setValue] = useState("")
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const handleLogout = ()=>{
        clear()
        dispatch(Logout())
        navigate('/login')
    }

    return (
        <div className='header'>
            <img src={Hamburger} onClick={() => setVisible(!visible)} className='hamburger' alt='hamburger' width={30} height={30} />
            <p className='title'>
                {title}
            </p>
            <div className='search-control'>
                <input type='search' value={value} onChange={(e) => setValue(e.target.value)} placeholder={`Search ${title}...`} className='search-input' />
                {
                    !value
                    &&
                    <img src={SearchIcon} width={30} height={30} alt='search-icon' />
                }
            </div>
            <button className='bg-primary logout-btn' onClick={handleLogout}>Log Out</button>
        </div>
    )
}

export default Header