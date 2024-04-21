import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const MyEditor = ({text,setFieldValue,fieldName}) => {

    const handleChange = (value) => {
        setFieldValue(fieldName,value);
    };

    return (
        <div
            style={{
                borderRadius: "10px",
                marginBottom: "10px",
                marginTop:"10px"
            }}
        >
            <ReactQuill style={{height:"200px",paddingBottom:"40px"}}   value={text} onChange={handleChange} />
        </div>
    );
};

export default MyEditor;
