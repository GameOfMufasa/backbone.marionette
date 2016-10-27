import _ from 'underscore';
import emulateCollection from './utils/emulate-collection';

// Provide a container to store, retrieve and
// shut down child views.
const Container = function() {
  this._views = [];
  this._viewsByCid = {};
  this._indexByModel = {};
  this._updateLength();
};

emulateCollection(Container.prototype, '_views');

// Container Methods
// -----------------

_.extend(Container.prototype, {

  // Add a view to this container. Stores the view
  // by `cid` and makes it searchable by the model
  // cid (and model itself). Additionally is stores
  // the view by index in the _views array
  _add(view, index) {
    const viewCid = view.cid;

    // store the view
    this._viewsByCid[viewCid] = view;

    // index it by model
    if (view.model) {
      this._indexByModel[view.model.cid] = viewCid;
    }

    // add to end by default
    index = index || this._views.length;
    this._views.splice(index, 0, view);

    this._updateLength();

    return this;
  },

  // Replace array contents without overwriting the reference.
  _set(views) {
    this._views.length = 0;

    this._views.push.apply(this._views, views.slice(0));

    this._updateLength();
  },

  // Find a view by the model that was attached to it.
  // Uses the model's `cid` to find it.
  findByModel(model) {
    return this.findByModelCid(model.cid);
  },

  // Find a view by the `cid` of the model that was attached to it.
  // Uses the model's `cid` to find the view `cid` and
  // retrieve the view using it.
  findByModelCid(modelCid) {
    const viewCid = this._indexByModel[modelCid];
    return this.findByCid(viewCid);
  },

  // Find a view by index.
  findByIndex(index) {
    return this._views[index];
  },

  // Find the index of a view instance
  findIndexByView(view) {
    return this._views.indexOf(view);
  },

  // Retrieve a view by its `cid` directly
  findByCid(cid) {
    return this._viewsByCid[cid];
  },

  // Remove a view
  _remove(view) {
    // delete model index
    if (view.model) {
      delete this._indexByModel[view.model.cid];
    }

    // remove the view from the container
    delete this._viewsByCid[view.cid];

    const index = this.findIndexByView(view);
    this._views.splice(index, 1);

    this._updateLength();

    return this;
  },

  // Update the `.length` attribute on this container
  _updateLength() {
    this.length = this._views.length;

    return this;
  }
});

export default Container;