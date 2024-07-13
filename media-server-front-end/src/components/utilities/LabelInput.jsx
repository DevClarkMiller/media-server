const LabelInput = (
    {onChange, value, children, id, type, min, max, inputClassName, labelClassName, required}
) => {
    return(
        <span className="col-flex-center gap-1">
            <label 
                htmlFor={id}
                className={labelClassName}
            >{children}
            </label>
            <input 
                className={inputClassName}
                onChange={onChange} 
                value={value} 
                id={id}
                type={type} 
                min={min} 
                max={max} 
                required={required}
            ></input>
        </span>
    );
}

export default LabelInput;