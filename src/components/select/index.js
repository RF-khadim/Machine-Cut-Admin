import React from 'react';
import './styles.css'

const ReactSelect = ({
    options,
    value,
    disabled,
    name,
    setFieldValue
}) => {
    const onChange = (e) => {
        setFieldValue(name, e.target.value);
    };

    return (
        <select
            disabled={disabled}
            className='select-input'
            value={value}
            name={name}
            onChange={onChange}>
            <option selected value="" disabled>Select {name?.split("_").join(" ")}</option>
            {
                options?.map(o => (
                    <option key={o?.value} value={o?.value}>{o?.label}</option>
                ))
            }
        </select>
    );
};

export default ReactSelect;
