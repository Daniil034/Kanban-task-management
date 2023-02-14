import { useState } from "react";
import ModalButtons from "../components/ModalButtons";
import logoMobile from "../assets/logo-mobile.svg";
import iconPlus from "../assets/icon-add-task-mobile.svg";
import iconDots from "../assets/icon-vertical-ellipsis.svg";
import iconChevron from "../assets/icon-chevron-down.svg";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectColumnsAllIds } from "../features/columnsSlice";
import "../UI/header.scss";

const Header = ({ currentBoard, showSidebar, toggleSidebar }) => {
  const navigate = useNavigate();
  const boardColumns = useSelector(selectColumnsAllIds);
  const [showSideButtons, setShowSideButtons] = useState(false);

  const handleSideButtonsClick = () => {
    currentBoard.name && setShowSideButtons(true);
  };

  return (
    <>
      <header className="header">
        <div className="header__left">
          <img className="header__logo" src={logoMobile} alt="logo" />
          <button
            className={
              currentBoard.name
                ? "header__pick-board header__pick-board--active"
                : "header__pick-board"
            }
            onClick={toggleSidebar}
            type='button'
          >
            <span className="header__pick-board-text">
              {" "}
              {currentBoard.name || "Not selected"}
            </span>
            <img
              className={
                showSidebar
                  ? "header__pick-board-icon header__pick-board-icon--active"
                  : "header__pick-board-icon"
              }
              src={iconChevron}
            />
          </button>
        </div>

        <div className="header__right">
          <Link
            className={
              boardColumns.length
                ? "header__new-task-btn header__new-task-btn--active"
                : "header__new-task-btn"
            }
            to={`/boards/${currentBoard.name}/tasks/new`}
          >
            <img
              className="header__task-icon"
              src={iconPlus}
              alt="Side buttons"
            />
            <span className="header__task-text">+ Add New Task</span>
          </Link>
          <div className="header__modal-buttons-container">
            <button
              className="header__modal-buttons"
              type="button"
              onClick={handleSideButtonsClick}
            >
              <img className="header__modal-buttons-img" src={iconDots} />
            </button>

            <ModalButtons
              parent={"Board"}
              showSideButtons={showSideButtons}
              setShowSideButtons={setShowSideButtons}
              editAction={() => navigate(`/boards/${currentBoard.name}/edit`)}
              deleteAction={() =>
                navigate(`/boards/${currentBoard.name}/delete`)
              }
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
