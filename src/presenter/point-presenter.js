import { remove, render, replace } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import EventView from '../view/event-view.js';
import { UserAction, UpdateType } from '../const.js';
import dayjs from 'dayjs';


const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #onDataChange = null;

  #componentEvent = null;
  #componentEventEdit = null;

  #point = null;

  #onModeChange = null;
  #mode = MODE.DEFAULT;

  constructor({ pointListContainer, onDataChange, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#componentEvent;
    const prevPointEditComponent = this.#componentEventEdit;

    this.#componentEvent = new EventView({
      point: this.#point,
      onEditClick: this.#onEditClick,
      onFavoriteClick: this.#onFavoriteClick,
    });

    this.#componentEventEdit = new EventEditView({
      point: this.#point,
      onResetClick: this.#onResetClick,
      onSubmiClick: this.#onSubmiClick,
      onEditSavePointClick: this.#onEditSavePointClick,
      onDeleteClick: this.#handleDeleteClick,
    });

    if (!prevPointComponent || !prevPointEditComponent) {
      render(this.#componentEvent, this.#pointListContainer);
      return;
    }

    if (this.#mode === MODE.DEFAULT) {
      replace(this.#componentEvent, prevPointComponent);
    }

    if (this.#mode === MODE.EDITING) {
      replace(this.#componentEventEdit, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView = () => {
    if (this.#mode !== MODE.DEFAULT) {
      this.#replaceFormToPoint();
    }
  };

  destroy = () => {
    remove(this.#componentEvent);
    remove(this.#componentEventEdit);
  };

  #replacePointToForm() {
    replace(this.#componentEventEdit, this.#componentEvent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#onModeChange();
    this.#mode = MODE.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#componentEvent, this.#componentEventEdit);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = MODE.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #onEditClick = () => {
    this.#replacePointToForm();
  };

  #onSubmiClick = (update) => {
    const isMinorUpdate = dayjs(update.start).isSame(this.#point.start)
    || dayjs(update.end).isSame(this.#point.end)
    || update.price === this.#point.price;

    this.#onDataChange(
      UserAction.UPDATE_TASK,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceFormToPoint();
  };

  #handleDeleteClick = (task) => {
    this.#onDataChange(
      UserAction.DELETE_TASK,
      UpdateType.MINOR,
      task,
    );
  };

  #onResetClick = (point) => {
    this.#replaceFormToPoint();
    this.#onEditSavePointClick(point);
  };

  #onFavoriteClick = () => {
    this.#onDataChange(
      UserAction.UPDATE_TASK,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #onEditSavePointClick = (point) => {
    this.#onDataChange(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      point
    );
  };
}