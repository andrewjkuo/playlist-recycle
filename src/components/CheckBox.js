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
            <div className="tooltip tooltip_l">
                <p>{label}</p>
                <span className="tooltiptext tooltiptext_l">
                    If unchecked, explicit tracks will be excluded.
                </span>
            </div>
        </label>
        </div>
    );
};

export default CheckBox