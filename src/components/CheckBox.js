const CheckBox = ({checked, setChecked, label}) => {
    const handleChange = () => {
        setChecked(!checked);
    };

    return (
        <div className="checkbox">
        <label>
            <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            />
            {label}
        </label>
        </div>
    );
};

export default CheckBox