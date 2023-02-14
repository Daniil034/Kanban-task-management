import Select from "react-select";
import "../UI/selectColumn.scss";

const SelectColumn = ({ options, action, defaultOption }) => {
  return (
    <Select
      menuPortalTarget={document.body}
      options={options}
      onChange={action}
      isSearchable={false}
      defaultValue={defaultOption}
      menuPosition="fixed"
      className="select-column__container"
      classNamePrefix="select-column"
      // menuIsOpen={true}
    />
  );
};

export default SelectColumn;
