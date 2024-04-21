import { useState } from 'react';
import { useMutation } from 'react-query'
import apiService from '../../services/apiService'
import AccordionDown from '../../assets/images/accordion-down.png'
import HorizontalDots from '../../assets/images/horizontal-dots.jpg'

import './styles.css'
import { useRef } from 'react';
import { useEffect } from 'react';
import Toastify from '../toast';

const Category = ({
    data,
    refetch,
    checkedCat, setCheckedCat,
    loading,
    isEdit
}) => {
    const [cat, setCat] = useState("")
    const [update, setUpdate] = useState(false)
    const [open, setOpen] = useState(true)
    const [catId, setCatId] = useState("");
    const [addUpdateCat, setAddUpdateCat] = useState("")

    const addCat = useMutation((data) => apiService.addCategory(data), {
        onSuccess: (data) => {
            setUpdate(false)
            refetch()
            setCat("")
            setCatId("")
            Toastify("success", data?.message)
        },
        onError: (err) => {
            Toastify("error", err?.message)

        }
    })
    const updateCat = useMutation((data) => apiService.updateCategory(data, data?._id), {
        onSuccess: (data) => {
            setUpdate(false)
            refetch()
            setCatId("")
            setCat("")
            Toastify("success", data?.message)
        },
        onError: (err) => {
            Toastify("error", err?.message)

        }
    })
    const deleteCategory = useMutation((data) => apiService.deleteCategory(data), {
        onSuccess: (data) => {
            setUpdate(false)
            setCat("")
            setCatId("")
            refetch()
            Toastify("success", data?.message)
        },
        onError: (err) => {
            Toastify("error", err?.message)

        }
    })



    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setCatId("")
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddAndUpdate = (item, parent) => {

        if (!update) {
            addCat.mutate({
                name: cat,
                parent: item?._id ? item?._id : null,
                product: isEdit
            })

        } else {
            updateCat.mutate({
                _id: item?._id,
                name: cat,
            })
        }

        setCat("")
        setAddUpdateCat("")

    }


    const handleChecked = (e, id, parent, count) => {



        // if (checkedCat.length >= 4 || (parent && count ===0) ) {
        //     setCheckedCat([]);
        // }

        if (e.target.checked) {
            setCheckedCat((prevChecked) => [...prevChecked, id]);
        } else {
            setCheckedCat((prevChecked) => prevChecked.filter((c) => c !== id));
        }
    };


    const removeCategory = (id) => {
        deleteCategory.mutate({
            _id: id
        })
    }


    const showCategories = (arr, count) => {

        if (arr?.length === 0 && count === 3) return null;


        return (
            <>
                {arr?.map((item, index) => (
                    <div className="category-item" key={item?.id + index}>
                        <div className="category-content">
                            <div className='general-info'>
                                <img src={AccordionDown} alt="category" width={20} height={20} />
                                <input type="checkbox" checked={checkedCat.includes(item?._id)} onClick={(e) => handleChecked(e, item?._id, item?.parent, count)} />
                                <p>{item?.name}</p>

                            </div>

                            <div className='three-dots' onClick={() => setCatId(item?._id)}>
                                <img src={HorizontalDots} width={30} height={30} alt='horizontal-dots' />
                                {
                                    item?._id === catId &&
                                    <div ref={ref} className='category-menu'>
                                        {
                                            count !== 3 &&
                                            <p onClick={() => {
                                                setCatId("")
                                                setAddUpdateCat(item?._id);
                                                setUpdate(false)
                                            }}>
                                                {
                                                    count !== 3 && count === 0 ? "Add Group" : count === 1 ? "Add Cut Data" : count === 2 ? "New Sub Group" : ""
                                                }
                                            </p>
                                        }
                                        <hr />
                                        <p
                                            onClick={() => {
                                                setCat(item?.name)
                                                setAddUpdateCat(item?._id);
                                                setUpdate(true)
                                            }}
                                        >Edit</p>
                                        <p className='red' onClick={() => removeCategory(item?._id)}>{deleteCategory.isLoading ? "Please wait..." : "Delete"}</p>
                                    </div>
                                }
                            </div>

                        </div>
                        {

                            addUpdateCat === item?._id &&

                            <div className='new-category'>
                                <div className="input-control">
                                    <input
                                        type="text"
                                        placeholder={
                                            count !== 3 && count === 0 ? "Add Group" : count === 1 ? "Add Cut Data" : count === 2 ? "New Sub Group" : ""
                                        }
                                        name="length"
                                        value={cat}
                                        onChange={(e) => setCat(e.target.value)}
                                    />

                                </div>
                                <button onClick={() => handleAddAndUpdate(item, item?.parent)}>{addCat.isLoading || updateCat.isLoading || deleteCategory.isLoading ? "Please wait..." : update ? "Update" : "Add"}</button>
                            </div>
                        }
                        {item?.child && checkedCat.includes(item?._id) && count !== 3 && (
                            <div className="sub-category-items">
                                {showCategories(item?.child, count + 1)}
                            </div>
                        )}
                    </div>
                ))}
            </>
        );
    };


    return (
        <div className='category-container'>
            <div onClick={() => setOpen(!open)} className='category-header'>
                <p>Category</p>
                <img src={AccordionDown} alt='category' width={20} height={20} />
            </div>
            {
                open && data?.length > 0 &&
                showCategories(data, 0)
            }
            {
                loading && <center> Loading...</center>
            }

            {!update && !catId && !addUpdateCat &&

                <div className='new-category'>
                    <div className="input-control">
                        <input
                            type="text"
                            placeholder="Add Main Category"
                            name="length"
                            value={cat}
                            onChange={(e) => setCat(e.target.value)}
                        />

                    </div>
                    <button onClick={() => addCat.mutate({ parent: null, name: cat, product: isEdit })}>{addCat.isLoading ? "Please wait..." : update ? "Update" : "Add"}</button>
                </div>

            }
        </div>
    )
}

export default Category