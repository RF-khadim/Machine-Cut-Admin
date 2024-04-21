import { Link } from 'react-router-dom'
import './styles.css'
import Layout from '../../layout'
import Header from '../../components/header'



const Info = () => {
    return (
        <Layout Header={(setVisible, visible) => <Header setVisible={setVisible} visible={visible} title="Machine" />}>

            <div className="info-container">
                <div className="d-flex info-heading">
                    <Link style={{ color: "blue" }} to="/machines" >
                        Machines {" "}
                    </Link>

                    <p> Info </p>
                </div>
                <h3>SYSTEM INFO</h3>
                <div className='detail'>
                    <div className="desc">
                        <p className='first'>Device Serial:</p>
                        <p className='second'>DX23467890765467657678878F</p>
                    </div>
                    <div className="desc">
                        <p className='first'>Device Model:</p>
                        <p className='second'>CC0091</p>
                    </div>
                    <div className="desc">
                        <p className='first'>Total Machine Cuts:</p>
                        <p className='second'>12555</p>
                    </div>
                    <div className="desc">
                        <p className='first'>Software Version:</p>
                        <p className='second'>V1.1.1</p>
                    </div>
                    <div className="desc">
                        <p className='first'>Uniqus ID:</p>
                        <p className='second'>1EAB-C7D7-5555-FE00</p>
                    </div>
                    <div className="desc">
                        <p className='first'>Service History:</p>
                        <p className='second'>2023-03-03</p>
                    </div>
                    <div className="desc">
                        <p className='first'>Server Connection:</p>
                        <p className='second'>Failure(44)</p>
                    </div>
                    <div className="desc">
                        <p className='first'>ID Registered:</p>
                        <p className='second'>Registered</p>
                    </div>
                    <div className="desc">
                        <p className='first'>Data Version:</p>
                        <p className='second'>20230114</p>
                    </div>
                    <div className="desc">
                        <p className='first'>Date Time:</p>
                        <p className='second'>20230201753</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Info