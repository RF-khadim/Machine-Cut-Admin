import './styles.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import BackArrow from '../../assets/images/backArrow.png'
import ProductDetail from './productDetail';
import Specifications from './specification';

const ProductSection = ({ formik, title, categories, isEdit, setIsOpen }) => {
    return (
        <div className="product-container">
            <div className='product-header'>
                <img src={BackArrow} onClick={() => setIsOpen(false)} alt='backarrow' height={30} width={30} />
                <h2 className='name'>{title}</h2>
                <button type='button' onClick={formik.handleSubmit}>{isEdit ?"Update":"Save"}</button>
            </div>
            {
                !isEdit &&
                <ProductDetail formik={formik} categories={categories} />
            }


            {
                isEdit &&
                <Tabs className="tabs" style={{marginBottom:"0px"}}>
                    <TabList>
                        <Tab>General</Tab>
                        <Tab>Library Category And Settings</Tab>
                    </TabList>

                    <TabPanel>
                        <ProductDetail formik={formik} />
                    </TabPanel>
                    <TabPanel>
                        <Specifications isEdit={isEdit} formik={formik} />
                    </TabPanel>
                    
                </Tabs>
            }


        </div>

    )
}


export default ProductSection