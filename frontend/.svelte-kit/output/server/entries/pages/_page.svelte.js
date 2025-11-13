import { b as set_current_component, d as current_component, r as run_all, c as create_ssr_component, a as subscribe, f as createEventDispatcher, h as add_attribute, v as validate_component, e as escape, i as each, o as onDestroy } from "../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
import { t, c as currentUser, T as ThemeToggle, L as LanguageToggle, n as notifications, i as isAuthenticated } from "../../chunks/LanguageToggle.js";
import { d as derived, w as writable } from "../../chunks/index.js";
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length) binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function createFileManagerStore() {
  const { subscribe: subscribe2, set, update: update2 } = writable({
    files: [],
    currentFolderId: null,
    breadcrumbPath: [],
    selectedItems: /* @__PURE__ */ new Set(),
    isLoading: false,
    currentSection: "mydrive",
    sortColumn: "name",
    sortDirection: "asc"
  });
  return {
    subscribe: subscribe2,
    setFiles: (files) => update2((state) => ({ ...state, files })),
    setLoading: (isLoading) => update2((state) => ({ ...state, isLoading })),
    setCurrentFolder: (folderId) => update2((state) => ({ ...state, currentFolderId: folderId })),
    setBreadcrumbPath: (path) => update2((state) => ({ ...state, breadcrumbPath: path })),
    setSelectedItems: (items) => update2((state) => ({ ...state, selectedItems: new Set(items) })),
    clearSelection: () => update2((state) => ({ ...state, selectedItems: /* @__PURE__ */ new Set() })),
    toggleSelection: (itemId) => update2((state) => {
      const selected = new Set(state.selectedItems);
      if (selected.has(itemId)) {
        selected.delete(itemId);
      } else {
        selected.add(itemId);
      }
      return { ...state, selectedItems: selected };
    }),
    setSection: (section) => update2((state) => ({ ...state, currentSection: section })),
    setSort: (column, direction) => update2((state) => ({
      ...state,
      sortColumn: column,
      sortDirection: direction
    })),
    reset: () => set({
      files: [],
      currentFolderId: null,
      breadcrumbPath: [],
      selectedItems: /* @__PURE__ */ new Set(),
      isLoading: false,
      currentSection: "mydrive",
      sortColumn: "name",
      sortDirection: "asc"
    })
  };
}
const fileManager = createFileManagerStore();
const sortedFiles = derived(fileManager, ($fileManager) => {
  const { files, sortColumn, sortDirection } = $fileManager;
  return [...files].sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];
    if (sortColumn === "name") {
      aVal = aVal?.toLowerCase();
      bVal = bVal?.toLowerCase();
    }
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
});
const selectedCount = derived(
  fileManager,
  ($fileManager) => $fileManager.selectedItems.size
);
function createUploadStore() {
  const { subscribe: subscribe2, update: update2 } = writable([]);
  return {
    subscribe: subscribe2,
    add: (upload) => update2((uploads2) => [...uploads2, upload]),
    updateProgress: (id, progress, loaded, total) => update2(
      (uploads2) => uploads2.map((u) => u.id === id ? { ...u, progress, loaded, total } : u)
    ),
    setStatus: (id, status) => update2(
      (uploads2) => uploads2.map((u) => u.id === id ? { ...u, status } : u)
    ),
    remove: (id) => update2((uploads2) => uploads2.filter((u) => u.id !== id)),
    clear: () => update2(() => [])
  };
}
const uploads = createUploadStore();
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  let $currentUser, $$unsubscribe_currentUser;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_currentUser = subscribe(currentUser, (value) => $currentUser = value);
  createEventDispatcher();
  let searchQuery = "";
  $$unsubscribe_t();
  $$unsubscribe_currentUser();
  return `<div class="header"><div class="header-left" data-svelte-h="svelte-pmd1yv"><div class="logo">CloudCore Drive</div></div> <div class="search-container"><input type="text" class="search-box"${add_attribute("placeholder", $t("searchPlaceholder"), 0)}${add_attribute("value", searchQuery, 0)}> <div class="search-icon" data-svelte-h="svelte-9xewqh"><span class="material-symbols-outlined">search</span></div></div> <div class="header-right">${validate_component(ThemeToggle, "ThemeToggle").$$render($$result, {}, {}, {})} ${validate_component(LanguageToggle, "LanguageToggle").$$render($$result, {}, {}, {})} <button class="user-menu-btn"${add_attribute("title", $t("settings"), 0)}><span class="material-symbols-outlined" data-svelte-h="svelte-7rvcdf">account_circle</span> <span>${escape($currentUser?.username || "User")}</span></button></div> </div>`;
});
const Sidebar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let { currentSection = "mydrive" } = $$props;
  createEventDispatcher();
  const sections = [
    {
      id: "mydrive",
      icon: "storage",
      label: "myDrive"
    },
    {
      id: "recent",
      icon: "schedule",
      label: "recent"
    },
    {
      id: "shared",
      icon: "people",
      label: "shared"
    },
    {
      id: "trash",
      icon: "delete",
      label: "trash"
    }
  ];
  if ($$props.currentSection === void 0 && $$bindings.currentSection && currentSection !== void 0) $$bindings.currentSection(currentSection);
  $$unsubscribe_t();
  return `<div class="sidebar"> <div class="new-dropdown"><button class="${["new-button", ""].join(" ").trim()}"><span class="material-symbols-outlined" data-svelte-h="svelte-1wztoae">add</span> <span>${escape($t("new"))}</span> <span class="material-symbols-outlined dropdown-arrow" data-svelte-h="svelte-1113dzk">expand_more</span></button> ${``}</div>  ${each(sections.slice(0, 3), (section) => {
    return `<button class="${["sidebar-item", currentSection === section.id ? "active" : ""].join(" ").trim()}"><span class="material-symbols-outlined">${escape(section.icon)}</span> <span>${escape($t(section.label))}</span> </button>`;
  })} <div class="sidebar-divider"></div>  <button class="${["sidebar-item", currentSection === "trash" ? "active" : ""].join(" ").trim()}"><span class="material-symbols-outlined" data-svelte-h="svelte-1v24jz4">delete</span> <span>${escape($t("trash"))}</span></button> </div>`;
});
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
function formatDateTime(dateString) {
  if (!dateString) return "-";
  const utcString = dateString.endsWith("Z") ? dateString : dateString + "Z";
  const localDate = new Date(utcString);
  const now = /* @__PURE__ */ new Date();
  if (localDate.toDateString() === now.toDateString()) {
    return localDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  } else {
    return localDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }
}
function getFileIcon(item) {
  if (item.type === "folder") {
    return { icon: "folder", class: "folder" };
  }
  const ext = item.name?.split(".").pop()?.toLowerCase();
  const mimeType = item.mimeType || "";
  if (mimeType.startsWith("image/")) {
    return { icon: "image", class: "image" };
  } else if (ext === "pdf" || mimeType === "application/pdf") {
    return { icon: "picture_as_pdf", class: "pdf" };
  } else if (ext === "html" || mimeType === "text/html") {
    return { icon: "code", class: "html" };
  } else if (mimeType.startsWith("text/")) {
    return { icon: "description", class: "file" };
  } else {
    return { icon: "description", class: "file" };
  }
}
const FileRow = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let icon;
  let sizeDisplay;
  let { item } = $$props;
  let { selected = false } = $$props;
  let { isTrashView = false } = $$props;
  createEventDispatcher();
  if ($$props.item === void 0 && $$bindings.item && item !== void 0) $$bindings.item(item);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0) $$bindings.selected(selected);
  if ($$props.isTrashView === void 0 && $$bindings.isTrashView && isTrashView !== void 0) $$bindings.isTrashView(isTrashView);
  icon = getFileIcon(item);
  sizeDisplay = item.type === "file" && item.fileSize ? formatFileSize(item.fileSize) : "-";
  return `<tr class="${[
    "file-list-row",
    (selected ? "selected" : "") + " " + (isTrashView ? "trash-mode" : "") + " "
  ].join(" ").trim()}"${add_attribute("data-item-id", item.id, 0)}${add_attribute("data-item-type", item.type, 0)}${add_attribute("draggable", !isTrashView, 0)}><td class="col-indicator"></td> <td><span class="${"file-list-icon " + escape(icon.class, true) + " material-symbols-outlined"}">${escape(icon.icon)}</span> ${escape(item.name)}</td> <td>${escape(formatDateTime(item.createdAt))}</td> <td>${escape(formatDateTime(item.updatedAt))}</td> <td>${escape(sizeDisplay)}</td> </tr>`;
});
const FileList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let sortedFiles2;
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let { files = [] } = $$props;
  let { isLoading = false } = $$props;
  let { isTrashView = false } = $$props;
  let { selectedItems = /* @__PURE__ */ new Set() } = $$props;
  createEventDispatcher();
  let sortColumn = "name";
  if ($$props.files === void 0 && $$bindings.files && files !== void 0) $$bindings.files(files);
  if ($$props.isLoading === void 0 && $$bindings.isLoading && isLoading !== void 0) $$bindings.isLoading(isLoading);
  if ($$props.isTrashView === void 0 && $$bindings.isTrashView && isTrashView !== void 0) $$bindings.isTrashView(isTrashView);
  if ($$props.selectedItems === void 0 && $$bindings.selectedItems && selectedItems !== void 0) $$bindings.selectedItems(selectedItems);
  sortedFiles2 = [...files].sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];
    {
      aVal = aVal?.toLowerCase();
      bVal = bVal?.toLowerCase();
    }
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });
  $$unsubscribe_t();
  return ` <div class="${["file-container", ""].join(" ").trim()}">${isLoading ? `<div class="skeleton-loader">${each(Array(10), (_, i) => {
    return `<div class="skeleton-row" data-svelte-h="svelte-efx0qk"><div class="skeleton-icon"></div> <div class="skeleton-text skeleton-name"></div> <div class="skeleton-text skeleton-date"></div> <div class="skeleton-text skeleton-date"></div> <div class="skeleton-text skeleton-size"></div> </div>`;
  })}</div>` : `${files.length === 0 ? `<div class="empty-state"><span class="material-symbols-outlined empty-icon" data-svelte-h="svelte-10h1vwd">folder_open</span> <h3>${escape($t("emptyFolder"))}</h3> <p>${escape($t("uploadGetStarted"))}</p></div>` : `<table class="file-list"><thead class="file-list-header"><tr><th class="col-indicator"></th> <th class="sortable">${escape($t("name"))} ${`<span class="sort-icon material-symbols-outlined">${escape(
    "arrow_upward"
  )}</span>`}</th> <th class="sortable">${escape($t("created"))} ${``}</th> <th class="sortable">${escape($t("modified"))} ${``}</th> <th class="sortable">${escape($t("size"))} ${``}</th></tr></thead> <tbody>${each(sortedFiles2, (file) => {
    return `${validate_component(FileRow, "FileRow").$$render(
      $$result,
      {
        item: file,
        selected: selectedItems.has(file.id),
        isTrashView
      },
      {},
      {}
    )}`;
  })}</tbody></table>`}`} </div>`;
});
const Toolbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let showActions;
  let showTrashActions;
  let canRename;
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let { selectedCount: selectedCount2 = 0 } = $$props;
  let { isTrashView = false } = $$props;
  let { visible = true } = $$props;
  createEventDispatcher();
  if ($$props.selectedCount === void 0 && $$bindings.selectedCount && selectedCount2 !== void 0) $$bindings.selectedCount(selectedCount2);
  if ($$props.isTrashView === void 0 && $$bindings.isTrashView && isTrashView !== void 0) $$bindings.isTrashView(isTrashView);
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0) $$bindings.visible(visible);
  showActions = selectedCount2 > 0 && !isTrashView;
  showTrashActions = selectedCount2 > 0 && isTrashView;
  canRename = selectedCount2 === 1;
  $$unsubscribe_t();
  return `${visible ? `<div class="${["toolbar", visible ? "visible" : ""].join(" ").trim()}"><div class="toolbar-left"> ${!isTrashView ? `<button class="toolbar-btn" id="newFolderBtn"><span class="material-symbols-outlined" data-svelte-h="svelte-1yrk8lh">create_new_folder</span> <span>${escape($t("newFolder"))}</span></button>` : ``}  ${isTrashView ? `<button class="toolbar-btn toolbar-btn-danger" id="emptyTrashBtn"><span class="material-symbols-outlined" data-svelte-h="svelte-mhtuwv">delete_sweep</span> <span>${escape($t("deleteAllForever"))}</span></button>` : ``}  ${showActions ? `<div class="toolbar-actions"><button class="toolbar-btn icon-btn toolbar-close-btn" data-svelte-h="svelte-f1ccuo"><span class="material-symbols-outlined">close</span></button> <button class="toolbar-btn"><span class="material-symbols-outlined" data-svelte-h="svelte-yi50h3">download</span> <span>${escape($t("download"))}</span></button> <button class="toolbar-btn"><span class="material-symbols-outlined" data-svelte-h="svelte-xnqhu4">drive_file_move</span> <span>${escape($t("move"))}</span></button> <button class="toolbar-btn" ${!canRename ? "disabled" : ""}><span class="material-symbols-outlined" data-svelte-h="svelte-4hi8s3">edit</span> <span>${escape($t("rename"))}</span></button> <button class="toolbar-btn toolbar-btn-danger"><span class="material-symbols-outlined" data-svelte-h="svelte-1v24jz4">delete</span> <span>${escape($t("delete"))}</span></button> <div class="toolbar-divider"></div> <span class="toolbar-selection-count">${escape(selectedCount2)} ${escape($t("selected"))}</span></div>` : ``}  ${showTrashActions ? `<div class="toolbar-actions-trash"><button class="toolbar-btn icon-btn toolbar-close-btn" data-svelte-h="svelte-f1ccuo"><span class="material-symbols-outlined">close</span></button> <button class="toolbar-btn"><span class="material-symbols-outlined" data-svelte-h="svelte-ytbc01">restore_from_trash</span> <span>${escape($t("restore"))}</span></button> <button class="toolbar-btn toolbar-btn-danger"><span class="material-symbols-outlined" data-svelte-h="svelte-1mnli2o">delete_forever</span> <span>${escape($t("deletePermanently"))}</span></button> <div class="toolbar-divider"></div> <span class="toolbar-selection-count">${escape(selectedCount2)} ${escape($t("selected"))}</span></div>` : ``}</div></div>` : ``}`;
});
const Breadcrumbs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let { path = [] } = $$props;
  let { isTrashView = false } = $$props;
  createEventDispatcher();
  if ($$props.path === void 0 && $$bindings.path && path !== void 0) $$bindings.path(path);
  if ($$props.isTrashView === void 0 && $$bindings.isTrashView && isTrashView !== void 0) $$bindings.isTrashView(isTrashView);
  $$unsubscribe_t();
  return `<div class="breadcrumbs" id="breadcrumbs">${isTrashView ? `<span class="breadcrumb current">${escape($t("trash"))}</span>` : `<button class="${["breadcrumb", path.length === 0 ? "current" : ""].join(" ").trim()}">${escape($t("myDrive"))}</button> ${each(path, (folder, index) => {
    return `<span class="breadcrumb-separator" data-svelte-h="svelte-128r0vm">&gt;</span> <button class="${["breadcrumb", index === path.length - 1 ? "current" : ""].join(" ").trim()}">${escape(folder.name)} </button>`;
  })}`} </div>`;
});
const ContextMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let { visible = false } = $$props;
  let { x = 0 } = $$props;
  let { y = 0 } = $$props;
  let { item = null } = $$props;
  let { isTrashView = false } = $$props;
  createEventDispatcher();
  let menuElement;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0) $$bindings.visible(visible);
  if ($$props.x === void 0 && $$bindings.x && x !== void 0) $$bindings.x(x);
  if ($$props.y === void 0 && $$bindings.y && y !== void 0) $$bindings.y(y);
  if ($$props.item === void 0 && $$bindings.item && item !== void 0) $$bindings.item(item);
  if ($$props.isTrashView === void 0 && $$bindings.isTrashView && isTrashView !== void 0) $$bindings.isTrashView(isTrashView);
  $$unsubscribe_t();
  return ` ${visible && item ? `<div class="context-menu" style="${"left: " + escape(x, true) + "px; top: " + escape(y, true) + "px;"}"${add_attribute("this", menuElement, 0)}>${isTrashView ? `<div class="context-menu-item"><span class="material-symbols-outlined" data-svelte-h="svelte-ytbc01">restore_from_trash</span> <span>${escape($t("restore"))}</span></div> <div class="context-menu-separator"></div> <div class="context-menu-item danger"><span class="material-symbols-outlined" data-svelte-h="svelte-1mnli2o">delete_forever</span> <span>${escape($t("deletePermanently"))}</span></div>` : `${item.type === "file" ? `<div class="context-menu-item"><span class="material-symbols-outlined" data-svelte-h="svelte-yi50h3">download</span> <span>${escape($t("downloadFile"))}</span></div>` : `<div class="context-menu-item"><span class="material-symbols-outlined" data-svelte-h="svelte-yi50h3">download</span> <span>${escape($t("downloadFolder"))}</span></div>`} <div class="context-menu-separator"></div> <div class="context-menu-item"><span class="material-symbols-outlined" data-svelte-h="svelte-4hi8s3">edit</span> <span>${escape($t("rename"))}</span></div> <div class="context-menu-item"><span class="material-symbols-outlined" data-svelte-h="svelte-xnqhu4">drive_file_move</span> <span>${escape($t("move"))}</span></div> <div class="context-menu-separator"></div> <div class="context-menu-item danger"><span class="material-symbols-outlined" data-svelte-h="svelte-1v24jz4">delete</span> <span>${escape($t("delete"))}</span></div>`}</div>` : ``}`;
});
const UploadProgress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let visible;
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let { uploads: uploads2 = [] } = $$props;
  createEventDispatcher();
  function getStatusText(status) {
    const statuses = {
      uploading: $t("uploading"),
      completed: $t("uploadComplete"),
      error: $t("uploadFailed"),
      cancelled: $t("uploadCancelled")
    };
    return statuses[status] || status;
  }
  if ($$props.uploads === void 0 && $$bindings.uploads && uploads2 !== void 0) $$bindings.uploads(uploads2);
  visible = uploads2.length > 0;
  $$unsubscribe_t();
  return `${visible ? `<div class="${[
    "upload-progress-container",
    (visible ? "visible" : "") + " "
  ].join(" ").trim()}"><div class="upload-progress-header"><h3>${escape($t("uploadingFiles"))}</h3> <button class="upload-minimize-btn"${add_attribute("aria-label", "Minimize", 0)}><span class="material-symbols-outlined">${escape("expand_more")}</span></button></div> ${`<div class="upload-progress-list">${each(uploads2, (upload) => {
    return `<div class="${[
      "upload-item",
      (upload.status === "uploading" ? "uploading" : "") + " " + (upload.status === "completed" ? "completed" : "") + " " + (upload.status === "error" ? "error" : "")
    ].join(" ").trim()}"><div class="upload-item-header"><span class="material-symbols-outlined upload-item-icon">${upload.status === "uploading" ? `upload_file` : `${upload.status === "completed" ? `check_circle` : `${upload.status === "error" ? `error` : `cancel`}`}`}</span> <div class="upload-item-info"><div class="upload-item-name"${add_attribute("title", upload.fileName, 0)}>${escape(upload.fileName)}</div> <div class="upload-item-status">${upload.status === "uploading" ? `${escape(Math.round(upload.progress))}% • 
                                        ${escape(formatFileSize(upload.loaded))} / ${escape(formatFileSize(upload.total))}` : `${escape(getStatusText(upload.status))}`} </div></div> ${upload.status === "uploading" ? `<button class="upload-item-cancel" aria-label="Cancel upload" data-svelte-h="svelte-1o6tri8"><span class="material-symbols-outlined">close</span> </button>` : ``}</div> <div class="upload-progress-bar-container"><div class="upload-progress-bar" style="${"width: " + escape(upload.progress, true) + "%"}"></div></div> </div>`;
  })}</div>`}</div>` : ``}`;
});
const css$3 = {
  code: ".notification.svelte-1y34szl.svelte-1y34szl{position:relative;background:var(--bg-primary);color:var(--text-primary);padding:16px 20px;border-radius:12px;box-shadow:0 8px 24px var(--shadow-lg), 0 4px 12px var(--shadow-md);display:flex;align-items:flex-start;gap:16px;min-width:320px;max-width:400px;border-left:4px solid var(--color-blue);overflow:hidden}.notification.success.svelte-1y34szl.svelte-1y34szl{border-left-color:var(--color-green)}.notification.error.svelte-1y34szl.svelte-1y34szl{border-left-color:var(--color-red)}.notification.warning.svelte-1y34szl.svelte-1y34szl{border-left-color:var(--color-yellow)}.notification.info.svelte-1y34szl.svelte-1y34szl{border-left-color:var(--color-blue)}.notification-icon-wrapper.svelte-1y34szl.svelte-1y34szl{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;flex-shrink:0;background:var(--bg-secondary)}.notification.success.svelte-1y34szl .notification-icon-wrapper.svelte-1y34szl{background:rgba(52, 168, 83, 0.1)}.notification.error.svelte-1y34szl .notification-icon-wrapper.svelte-1y34szl{background:rgba(234, 67, 53, 0.1)}.notification.warning.svelte-1y34szl .notification-icon-wrapper.svelte-1y34szl{background:rgba(251, 188, 4, 0.1)}.notification-icon.svelte-1y34szl.svelte-1y34szl{font-size:24px;transition:transform 0.3s}.notification.success.svelte-1y34szl .notification-icon.svelte-1y34szl{color:var(--color-green)}.notification.error.svelte-1y34szl .notification-icon.svelte-1y34szl{color:var(--color-red)}.notification.warning.svelte-1y34szl .notification-icon.svelte-1y34szl{color:var(--color-yellow)}.notification.info.svelte-1y34szl .notification-icon.svelte-1y34szl{color:var(--color-blue)}.notification-content.svelte-1y34szl.svelte-1y34szl{flex:1;display:flex;flex-direction:column;gap:4px}.notification-title.svelte-1y34szl.svelte-1y34szl{font-size:15px;font-weight:600;color:var(--text-primary);line-height:1.4}.notification-message.svelte-1y34szl.svelte-1y34szl{font-size:13px;color:var(--text-secondary);line-height:1.5}.notification-close.svelte-1y34szl.svelte-1y34szl{background:transparent;border:none;cursor:pointer;padding:6px;border-radius:50%;color:var(--text-secondary);transition:all 0.2s ease;flex-shrink:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center}.notification-close.svelte-1y34szl.svelte-1y34szl:hover{background:var(--bg-hover);color:var(--text-primary);transform:rotate(90deg)}.notification-progress.svelte-1y34szl.svelte-1y34szl{position:absolute;bottom:0;left:0;height:3px;background:currentColor;opacity:0.3;border-radius:0 0 0 12px;transition:width 0.05s linear}",
  map: `{"version":3,"file":"Notification.svelte","sources":["Notification.svelte"],"sourcesContent":["<script>\\n    import { fly } from 'svelte/transition';\\n    import { createEventDispatcher, onMount } from 'svelte';\\n    \\n    export let type = 'info';\\n    export let title = '';\\n    export let message = '';\\n    export let duration = 5000;\\n    \\n    const dispatch = createEventDispatcher();\\n    \\n    const icons = {\\n        success: 'check_circle',\\n        error: 'error',\\n        warning: 'warning',\\n        info: 'info'\\n    };\\n    \\n    let progressWidth = 100;\\n    let interval;\\n    \\n    onMount(() => {\\n        if (duration > 0) {\\n            const step = 100 / (duration / 50);\\n            interval = setInterval(() => {\\n                progressWidth -= step;\\n                if (progressWidth <= 0) {\\n                    clearInterval(interval);\\n                    dispatch('close');\\n                }\\n            }, 50);\\n        }\\n        \\n        return () => clearInterval(interval);\\n    });\\n    \\n    function close() {\\n        dispatch('close');\\n    }\\n<\/script>\\n\\n<div \\n    class=\\"notification {type}\\"\\n    transition:fly={{ x: 400, duration: 400 }}\\n    role=\\"alert\\"\\n    aria-live=\\"polite\\"\\n>\\n    <div class=\\"notification-icon-wrapper\\">\\n        <span class=\\"notification-icon material-symbols-outlined\\">{icons[type]}</span>\\n    </div>\\n    <div class=\\"notification-content\\">\\n        {#if title}\\n            <div class=\\"notification-title\\">{title}</div>\\n        {/if}\\n        <div class=\\"notification-message\\">{message}</div>\\n    </div>\\n    <button class=\\"notification-close\\" on:click={close} aria-label=\\"Close\\">\\n        <span class=\\"material-symbols-outlined\\">close</span>\\n    </button>\\n    {#if duration > 0}\\n        <div class=\\"notification-progress\\" style=\\"width: {progressWidth}%\\"></div>\\n    {/if}\\n</div>\\n\\n<style>\\n    .notification {\\n        position: relative;\\n        background: var(--bg-primary);\\n        color: var(--text-primary);\\n        padding: 16px 20px;\\n        border-radius: 12px;\\n        box-shadow: 0 8px 24px var(--shadow-lg), 0 4px 12px var(--shadow-md);\\n        display: flex;\\n        align-items: flex-start;\\n        gap: 16px;\\n        min-width: 320px;\\n        max-width: 400px;\\n        border-left: 4px solid var(--color-blue);\\n        overflow: hidden;\\n    }\\n    \\n    .notification.success { border-left-color: var(--color-green); }\\n    .notification.error { border-left-color: var(--color-red); }\\n    .notification.warning { border-left-color: var(--color-yellow); }\\n    .notification.info { border-left-color: var(--color-blue); }\\n    \\n    .notification-icon-wrapper {\\n        display: flex;\\n        align-items: center;\\n        justify-content: center;\\n        width: 40px;\\n        height: 40px;\\n        border-radius: 50%;\\n        flex-shrink: 0;\\n        background: var(--bg-secondary);\\n    }\\n    \\n    .notification.success .notification-icon-wrapper {\\n        background: rgba(52, 168, 83, 0.1);\\n    }\\n    \\n    .notification.error .notification-icon-wrapper {\\n        background: rgba(234, 67, 53, 0.1);\\n    }\\n    \\n    .notification.warning .notification-icon-wrapper {\\n        background: rgba(251, 188, 4, 0.1);\\n    }\\n    \\n    .notification-icon {\\n        font-size: 24px;\\n        transition: transform 0.3s;\\n    }\\n    \\n    .notification.success .notification-icon { color: var(--color-green); }\\n    .notification.error .notification-icon { color: var(--color-red); }\\n    .notification.warning .notification-icon { color: var(--color-yellow); }\\n    .notification.info .notification-icon { color: var(--color-blue); }\\n    \\n    .notification-content {\\n        flex: 1;\\n        display: flex;\\n        flex-direction: column;\\n        gap: 4px;\\n    }\\n    \\n    .notification-title {\\n        font-size: 15px;\\n        font-weight: 600;\\n        color: var(--text-primary);\\n        line-height: 1.4;\\n    }\\n    \\n    .notification-message {\\n        font-size: 13px;\\n        color: var(--text-secondary);\\n        line-height: 1.5;\\n    }\\n    \\n    .notification-close {\\n        background: transparent;\\n        border: none;\\n        cursor: pointer;\\n        padding: 6px;\\n        border-radius: 50%;\\n        color: var(--text-secondary);\\n        transition: all 0.2s ease;\\n        flex-shrink: 0;\\n        width: 32px;\\n        height: 32px;\\n        display: flex;\\n        align-items: center;\\n        justify-content: center;\\n    }\\n    \\n    .notification-close:hover {\\n        background: var(--bg-hover);\\n        color: var(--text-primary);\\n        transform: rotate(90deg);\\n    }\\n    \\n    .notification-progress {\\n        position: absolute;\\n        bottom: 0;\\n        left: 0;\\n        height: 3px;\\n        background: currentColor;\\n        opacity: 0.3;\\n        border-radius: 0 0 0 12px;\\n        transition: width 0.05s linear;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAiEI,2CAAc,CACV,QAAQ,CAAE,QAAQ,CAClB,UAAU,CAAE,IAAI,YAAY,CAAC,CAC7B,KAAK,CAAE,IAAI,cAAc,CAAC,CAC1B,OAAO,CAAE,IAAI,CAAC,IAAI,CAClB,aAAa,CAAE,IAAI,CACnB,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,IAAI,CAAC,IAAI,WAAW,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,IAAI,CAAC,IAAI,WAAW,CAAC,CACpE,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,UAAU,CACvB,GAAG,CAAE,IAAI,CACT,SAAS,CAAE,KAAK,CAChB,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,YAAY,CAAC,CACxC,QAAQ,CAAE,MACd,CAEA,aAAa,sCAAS,CAAE,iBAAiB,CAAE,IAAI,aAAa,CAAG,CAC/D,aAAa,oCAAO,CAAE,iBAAiB,CAAE,IAAI,WAAW,CAAG,CAC3D,aAAa,sCAAS,CAAE,iBAAiB,CAAE,IAAI,cAAc,CAAG,CAChE,aAAa,mCAAM,CAAE,iBAAiB,CAAE,IAAI,YAAY,CAAG,CAE3D,wDAA2B,CACvB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,GAAG,CAClB,WAAW,CAAE,CAAC,CACd,UAAU,CAAE,IAAI,cAAc,CAClC,CAEA,aAAa,uBAAQ,CAAC,yCAA2B,CAC7C,UAAU,CAAE,KAAK,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CACrC,CAEA,aAAa,qBAAM,CAAC,yCAA2B,CAC3C,UAAU,CAAE,KAAK,GAAG,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CACrC,CAEA,aAAa,uBAAQ,CAAC,yCAA2B,CAC7C,UAAU,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CACrC,CAEA,gDAAmB,CACf,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,SAAS,CAAC,IAC1B,CAEA,aAAa,uBAAQ,CAAC,iCAAmB,CAAE,KAAK,CAAE,IAAI,aAAa,CAAG,CACtE,aAAa,qBAAM,CAAC,iCAAmB,CAAE,KAAK,CAAE,IAAI,WAAW,CAAG,CAClE,aAAa,uBAAQ,CAAC,iCAAmB,CAAE,KAAK,CAAE,IAAI,cAAc,CAAG,CACvE,aAAa,oBAAK,CAAC,iCAAmB,CAAE,KAAK,CAAE,IAAI,YAAY,CAAG,CAElE,mDAAsB,CAClB,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,GAAG,CAAE,GACT,CAEA,iDAAoB,CAChB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,GAAG,CAChB,KAAK,CAAE,IAAI,cAAc,CAAC,CAC1B,WAAW,CAAE,GACjB,CAEA,mDAAsB,CAClB,SAAS,CAAE,IAAI,CACf,KAAK,CAAE,IAAI,gBAAgB,CAAC,CAC5B,WAAW,CAAE,GACjB,CAEA,iDAAoB,CAChB,UAAU,CAAE,WAAW,CACvB,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,OAAO,CACf,OAAO,CAAE,GAAG,CACZ,aAAa,CAAE,GAAG,CAClB,KAAK,CAAE,IAAI,gBAAgB,CAAC,CAC5B,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,IAAI,CACzB,WAAW,CAAE,CAAC,CACd,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MACrB,CAEA,iDAAmB,MAAO,CACtB,UAAU,CAAE,IAAI,UAAU,CAAC,CAC3B,KAAK,CAAE,IAAI,cAAc,CAAC,CAC1B,SAAS,CAAE,OAAO,KAAK,CAC3B,CAEA,oDAAuB,CACnB,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,MAAM,CAAE,GAAG,CACX,UAAU,CAAE,YAAY,CACxB,OAAO,CAAE,GAAG,CACZ,aAAa,CAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CACzB,UAAU,CAAE,KAAK,CAAC,KAAK,CAAC,MAC5B"}`
};
const Notification = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { type = "info" } = $$props;
  let { title = "" } = $$props;
  let { message = "" } = $$props;
  let { duration = 5e3 } = $$props;
  createEventDispatcher();
  const icons = {
    success: "check_circle",
    error: "error",
    warning: "warning",
    info: "info"
  };
  let progressWidth = 100;
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.message === void 0 && $$bindings.message && message !== void 0) $$bindings.message(message);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0) $$bindings.duration(duration);
  $$result.css.add(css$3);
  return `<div class="${"notification " + escape(type, true) + " svelte-1y34szl"}" role="alert" aria-live="polite"><div class="notification-icon-wrapper svelte-1y34szl"><span class="notification-icon material-symbols-outlined svelte-1y34szl">${escape(icons[type])}</span></div> <div class="notification-content svelte-1y34szl">${title ? `<div class="notification-title svelte-1y34szl">${escape(title)}</div>` : ``} <div class="notification-message svelte-1y34szl">${escape(message)}</div></div> <button class="notification-close svelte-1y34szl" aria-label="Close" data-svelte-h="svelte-u4oole"><span class="material-symbols-outlined">close</span></button> ${duration > 0 ? `<div class="notification-progress svelte-1y34szl" style="${"width: " + escape(progressWidth, true) + "%"}"></div>` : ``} </div>`;
});
const css$2 = {
  code: ".notification-container.svelte-1ul8rpy{position:fixed;top:80px;right:24px;z-index:10002;display:flex;flex-direction:column;gap:12px;max-width:400px;pointer-events:none}.notification-container.svelte-1ul8rpy *{pointer-events:auto}",
  map: `{"version":3,"file":"NotificationContainer.svelte","sources":["NotificationContainer.svelte"],"sourcesContent":["<script>\\n    import { notifications } from '$lib/stores/notifications';\\n    import Notification from './Notification.svelte';\\n<\/script>\\n\\n<div class=\\"notification-container\\">\\n    {#each $notifications as notification (notification.id)}\\n        <Notification\\n            type={notification.type}\\n            title={notification.title}\\n            message={notification.message}\\n            duration={notification.duration}\\n            on:close={() => notifications.remove(notification.id)}\\n        />\\n    {/each}\\n</div>\\n\\n<style>\\n    .notification-container {\\n        position: fixed;\\n        top: 80px;\\n        right: 24px;\\n        z-index: 10002;\\n        display: flex;\\n        flex-direction: column;\\n        gap: 12px;\\n        max-width: 400px;\\n        pointer-events: none;\\n    }\\n    \\n    .notification-container :global(*) {\\n        pointer-events: auto;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAkBI,sCAAwB,CACpB,QAAQ,CAAE,KAAK,CACf,GAAG,CAAE,IAAI,CACT,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,KAAK,CACd,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,GAAG,CAAE,IAAI,CACT,SAAS,CAAE,KAAK,CAChB,cAAc,CAAE,IACpB,CAEA,sCAAuB,CAAS,CAAG,CAC/B,cAAc,CAAE,IACpB"}`
};
const NotificationContainer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $notifications, $$unsubscribe_notifications;
  $$unsubscribe_notifications = subscribe(notifications, (value) => $notifications = value);
  $$result.css.add(css$2);
  $$unsubscribe_notifications();
  return `<div class="notification-container svelte-1ul8rpy">${each($notifications, (notification) => {
    return `${validate_component(Notification, "Notification").$$render(
      $$result,
      {
        type: notification.type,
        title: notification.title,
        message: notification.message,
        duration: notification.duration
      },
      {},
      {}
    )}`;
  })} </div>`;
});
const css$1 = {
  code: ".modal-sm.svelte-1p6lv8l{max-width:400px}.modal-md.svelte-1p6lv8l{max-width:540px}.modal-lg.svelte-1p6lv8l{max-width:700px}.modal-xl.svelte-1p6lv8l{max-width:900px}",
  map: `{"version":3,"file":"Modal.svelte","sources":["Modal.svelte"],"sourcesContent":["<script>\\n    import { createEventDispatcher, onMount, onDestroy } from 'svelte';\\n    import { fade, scale } from 'svelte/transition';\\n    \\n    export let open = false;\\n    export let title = '';\\n    export let size = 'md';\\n    \\n    const dispatch = createEventDispatcher();\\n    \\n    function handleClose() {\\n        open = false;\\n        dispatch('close');\\n    }\\n    \\n    function handleKeyDown(e) {\\n        if (e.key === 'Escape' && open) {\\n            handleClose();\\n        }\\n    }\\n    \\n    function handleOverlayClick(e) {\\n        if (e.target === e.currentTarget) {\\n            handleClose();\\n        }\\n    }\\n    \\n    $: if (typeof document !== 'undefined') {\\n        if (open) {\\n            document.body.style.overflow = 'hidden';\\n        } else {\\n            document.body.style.overflow = '';\\n        }\\n    }\\n    \\n    onDestroy(() => {\\n        if (typeof document !== 'undefined') {\\n            document.body.style.overflow = '';\\n        }\\n    });\\n<\/script>\\n\\n<svelte:window on:keydown={handleKeyDown} />\\n\\n{#if open}\\n    <div \\n        class=\\"modal-overlay show\\"\\n        on:click={handleOverlayClick}\\n        transition:fade={{ duration: 300 }}\\n    ></div>\\n    \\n    <div \\n        class=\\"modal show modal-{size}\\"\\n        transition:scale={{ duration: 400, start: 0.9 }}\\n    >\\n        <div class=\\"modal-header\\">\\n            <h3>{title}</h3>\\n            <button \\n                class=\\"modal-close\\"\\n                on:click={handleClose}\\n                aria-label=\\"Close\\"\\n            >\\n                <span class=\\"material-symbols-outlined\\">close</span>\\n            </button>\\n        </div>\\n        \\n        <div class=\\"modal-body\\">\\n            <slot></slot>\\n        </div>\\n        \\n        <div class=\\"modal-footer\\">\\n            <slot name=\\"footer\\">\\n                <button class=\\"modal-btn modal-btn-secondary\\" on:click={handleClose}>\\n                    Cancel\\n                </button>\\n            </slot>\\n        </div>\\n    </div>\\n{/if}\\n\\n<style>\\n    /* Copy modal styles from main.css and settings.css */\\n    \\n    .modal-sm { max-width: 400px; }\\n    .modal-md { max-width: 540px; }\\n    .modal-lg { max-width: 700px; }\\n    .modal-xl { max-width: 900px; }\\n</style>\\n"],"names":[],"mappings":"AAmFI,wBAAU,CAAE,SAAS,CAAE,KAAO,CAC9B,wBAAU,CAAE,SAAS,CAAE,KAAO,CAC9B,wBAAU,CAAE,SAAS,CAAE,KAAO,CAC9B,wBAAU,CAAE,SAAS,CAAE,KAAO"}`
};
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { open = false } = $$props;
  let { title = "" } = $$props;
  let { size = "md" } = $$props;
  createEventDispatcher();
  onDestroy(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  });
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  $$result.css.add(css$1);
  {
    if (typeof document !== "undefined") {
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  }
  return ` ${open ? `<div class="modal-overlay show"></div> <div class="${"modal show modal-" + escape(size, true) + " svelte-1p6lv8l"}"><div class="modal-header"><h3>${escape(title)}</h3> <button class="modal-close" aria-label="Close" data-svelte-h="svelte-19rvgv4"><span class="material-symbols-outlined">close</span></button></div> <div class="modal-body">${slots.default ? slots.default({}) : ``}</div> <div class="modal-footer">${slots.footer ? slots.footer({}) : ` <button class="modal-btn modal-btn-secondary" data-svelte-h="svelte-16iigyi">Cancel</button> `}</div></div>` : ``}`;
});
const ConfirmDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let buttonClass;
  let { open = false } = $$props;
  let { title = "" } = $$props;
  let { message = "" } = $$props;
  let { confirmText = "Confirm" } = $$props;
  let { cancelText = "Cancel" } = $$props;
  let { type = "info" } = $$props;
  createEventDispatcher();
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.message === void 0 && $$bindings.message && message !== void 0) $$bindings.message(message);
  if ($$props.confirmText === void 0 && $$bindings.confirmText && confirmText !== void 0) $$bindings.confirmText(confirmText);
  if ($$props.cancelText === void 0 && $$bindings.cancelText && cancelText !== void 0) $$bindings.cancelText(cancelText);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    buttonClass = type === "danger" ? "modal-btn-danger" : "modal-btn-primary";
    $$rendered = `${validate_component(Modal, "Modal").$$render(
      $$result,
      { title, size: "sm", open },
      {
        open: ($$value) => {
          open = $$value;
          $$settled = false;
        }
      },
      {
        footer: () => {
          return `<button class="modal-btn modal-btn-secondary">${escape(cancelText)}</button> <button class="${"modal-btn " + escape(buttonClass, true)}">${escape(confirmText)}</button> `;
        },
        default: () => {
          return `<p>${escape(message)}</p>`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const RenameDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let { open = false } = $$props;
  let { item = null } = $$props;
  let { isLoading = false } = $$props;
  createEventDispatcher();
  let newName = "";
  let inputElement;
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.item === void 0 && $$bindings.item && item !== void 0) $$bindings.item(item);
  if ($$props.isLoading === void 0 && $$bindings.isLoading && isLoading !== void 0) $$bindings.isLoading(isLoading);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (open && item) {
        newName = item.name;
        tick().then(() => {
        });
      }
    }
    $$rendered = `${validate_component(Modal, "Modal").$$render(
      $$result,
      {
        title: $t("renameItem"),
        size: "sm",
        open
      },
      {
        open: ($$value) => {
          open = $$value;
          $$settled = false;
        }
      },
      {
        footer: () => {
          return `<button class="modal-btn modal-btn-secondary" ${isLoading ? "disabled" : ""}>${escape($t("cancel"))}</button> <button class="modal-btn modal-btn-primary" ${isLoading || !newName.trim() || newName === item?.name ? "disabled" : ""}>${escape(isLoading ? $t("processing") : $t("rename"))}</button> `;
        },
        default: () => {
          return `<label for="renameInput">${escape($t("newName"))}</label> <input type="text" id="renameInput" class="rename-input" ${isLoading ? "disabled" : ""} autocomplete="off" spellcheck="false"${add_attribute("value", newName, 0)}${add_attribute("this", inputElement, 0)}> <p class="rename-hint">${escape(item?.type === "folder" ? $t("folderNameHint") : $t("fileNameHint"))}</p>`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_t();
  return $$rendered;
});
const CreateFolderDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `//todo`;
});
const css = {
  code: "@import '$lib/styles/main.css';.main.svelte-l2hcqo{display:flex;height:calc(100vh - 64px)}.content.svelte-l2hcqo{flex:1;display:flex;flex-direction:column;overflow:hidden}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\n    import { onMount } from 'svelte';\\n    import { goto } from '$app/navigation';\\n    import { auth, isAuthenticated, currentUser } from '$lib/stores/auth';\\n    import { fileManager, sortedFiles, selectedCount } from '$lib/stores/fileManager';\\n    import { uploads } from '$lib/stores/uploads';\\n    import { notifications } from '$lib/stores/notifications';\\n    import { t } from '$lib/stores/i18n';\\n    import { api } from '$lib/services/api';\\n    \\n    import Header from '$lib/components/layout/Header.svelte';\\n    import Sidebar from '$lib/components/layout/Sidebar.svelte';\\n    import FileList from '$lib/components/file-manager/FileList.svelte';\\n    import Toolbar from '$lib/components/file-manager/Toolbar.svelte';\\n    import Breadcrumbs from '$lib/components/file-manager/Breadcrumbs.svelte';\\n    import ContextMenu from '$lib/components/file-manager/ContextMenu.svelte';\\n    import UploadProgress from '$lib/components/file-manager/UploadProgress.svelte';\\n    import NotificationContainer from '$lib/components/ui/NotificationContainer.svelte';\\n    import Modal from '$lib/components/ui/Modal.svelte';\\n    import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';\\n    import RenameDialog from '$lib/components/ui/RenameDialog.svelte';\\n    import CreateFolderDialog from '$lib/components/ui/CreateFolderDialog.svelte';\\n    \\n    let fileInput;\\n    let folderInput;\\n    \\n    // Context menu state\\n    let contextMenuVisible = false;\\n    let contextMenuX = 0;\\n    let contextMenuY = 0;\\n    let contextMenuItem = null;\\n    \\n    // Dialog states\\n    let showDeleteDialog = false;\\n    let showRenameDialog = false;\\n    let showCreateFolderDialog = false;\\n    let itemToDelete = null;\\n    let itemToRename = null;\\n    \\n    onMount(async () => {\\n        if (!$isAuthenticated) {\\n            goto('/login');\\n            return;\\n        }\\n        \\n        await loadFiles();\\n    });\\n    \\n    async function loadFiles(folderId = null) {\\n        fileManager.setLoading(true);\\n        fileManager.setCurrentFolder(folderId);\\n        \\n        try {\\n            const params = {};\\n            if (folderId) params.parentId = folderId;\\n            \\n            const data = await api.getFiles($currentUser.id, params);\\n            fileManager.setFiles(data);\\n        } catch (error) {\\n            console.error('Error loading files:', error);\\n            notifications.error($t('operationFailed'));\\n        } finally {\\n            fileManager.setLoading(false);\\n        }\\n    }\\n    \\n    // File operations\\n    async function handleFolderOpen(folder) {\\n        const currentPath = $fileManager.breadcrumbPath;\\n        fileManager.setBreadcrumbPath([...currentPath, folder]);\\n        await loadFiles(folder.id);\\n    }\\n    \\n    async function handleBreadcrumbNavigate(index) {\\n        if (index === -1) {\\n            fileManager.setBreadcrumbPath([]);\\n            await loadFiles(null);\\n        } else {\\n            const newPath = $fileManager.breadcrumbPath.slice(0, index + 1);\\n            fileManager.setBreadcrumbPath(newPath);\\n            await loadFiles(newPath[newPath.length - 1].id);\\n        }\\n    }\\n    \\n    async function handleUpload(files) {\\n        for (const file of files) {\\n            const uploadId = Date.now() + Math.random();\\n            \\n            uploads.add({\\n                id: uploadId,\\n                fileName: file.name,\\n                fileSize: file.size,\\n                progress: 0,\\n                loaded: 0,\\n                total: file.size,\\n                status: 'uploading'\\n            });\\n            \\n            try {\\n                await api.uploadFile(\\n                    $currentUser.id,\\n                    file,\\n                    $fileManager.currentFolderId,\\n                    (progress, loaded, total) => {\\n                        uploads.updateProgress(uploadId, progress, loaded, total);\\n                    }\\n                );\\n                \\n                uploads.setStatus(uploadId, 'completed');\\n                setTimeout(() => uploads.remove(uploadId), 3000);\\n            } catch (error) {\\n                uploads.setStatus(uploadId, 'error');\\n                notifications.error($t('uploadFailed'));\\n                setTimeout(() => uploads.remove(uploadId), 5000);\\n            }\\n        }\\n        \\n        await loadFiles($fileManager.currentFolderId);\\n    }\\n    \\n    function handleUploadFiles() {\\n        fileInput.click();\\n    }\\n    \\n    function handleUploadFolder() {\\n        folderInput.click();\\n    }\\n    \\n    async function handleDelete() {\\n        const selectedItems = Array.from($fileManager.selectedItems);\\n        itemToDelete = selectedItems;\\n        showDeleteDialog = true;\\n    }\\n    \\n    async function confirmDelete() {\\n        try {\\n            for (const itemId of itemToDelete) {\\n                await api.deleteItem($currentUser.id, itemId);\\n            }\\n            \\n            notifications.success($t('itemDeleted'));\\n            fileManager.clearSelection();\\n            await loadFiles($fileManager.currentFolderId);\\n        } catch (error) {\\n            notifications.error($t('operationFailed'));\\n        }\\n    }\\n    \\n    async function handleRename(item) {\\n        itemToRename = item;\\n        showRenameDialog = true;\\n    }\\n    \\n    async function confirmRename({ item, newName }) {\\n        try {\\n            await api.renameItem($currentUser.id, item.id, newName);\\n            notifications.success($t('itemRenamed'));\\n            await loadFiles($fileManager.currentFolderId);\\n            showRenameDialog = false;\\n        } catch (error) {\\n            notifications.error($t('operationFailed'));\\n        }\\n    }\\n    \\n    function handleContextMenu({ event, item }) {\\n        contextMenuVisible = true;\\n        contextMenuX = event.pageX;\\n        contextMenuY = event.pageY;\\n        contextMenuItem = item;\\n    }\\n    \\n    function handleContextMenuAction(action) {\\n        contextMenuVisible = false;\\n        \\n        switch (action) {\\n            case 'download':\\n                handleDownload(contextMenuItem);\\n                break;\\n            case 'rename':\\n                handleRename(contextMenuItem);\\n                break;\\n            case 'delete':\\n                itemToDelete = [contextMenuItem.id];\\n                showDeleteDialog = true;\\n                break;\\n        }\\n    }\\n<\/script>\\n\\n<svelte:head>\\n    <title>CloudCore Drive</title>\\n</svelte:head>\\n\\n<NotificationContainer />\\n\\n<Header on:search={(e) => console.log('Search:', e.detail)} />\\n\\n<div class=\\"main\\">\\n    <Sidebar \\n        currentSection={$fileManager.currentSection}\\n        on:sectionChange={(e) => fileManager.setSection(e.detail)}\\n        on:upload={handleUploadFiles}\\n        on:uploadFolder={handleUploadFolder}\\n    />\\n    \\n    <div class=\\"content\\">\\n        <Breadcrumbs \\n            path={$fileManager.breadcrumbPath}\\n            isTrashView={$fileManager.currentSection === 'trash'}\\n            on:navigate={(e) => handleBreadcrumbNavigate(e.detail)}\\n        />\\n        \\n        <Toolbar \\n            selectedCount={$selectedCount}\\n            isTrashView={$fileManager.currentSection === 'trash'}\\n            on:refresh={() => loadFiles($fileManager.currentFolderId)}\\n            on:download={handleDownload}\\n            on:delete={handleDelete}\\n            on:rename={() => handleRename(Array.from($fileManager.selectedItems)[0])}\\n            on:newFolder={() => showCreateFolderDialog = true}\\n            on:clearSelection={() => fileManager.clearSelection()}\\n        />\\n        \\n        <FileList \\n            files={$sortedFiles}\\n            isLoading={$fileManager.isLoading}\\n            isTrashView={$fileManager.currentSection === 'trash'}\\n            bind:selectedItems={$fileManager.selectedItems}\\n            on:folderOpen={(e) => handleFolderOpen(e.detail)}\\n            on:contextmenu={handleContextMenu}\\n        />\\n    </div>\\n</div>\\n\\n<ContextMenu\\n    visible={contextMenuVisible}\\n    x={contextMenuX}\\n    y={contextMenuY}\\n    item={contextMenuItem}\\n    isTrashView={$fileManager.currentSection === 'trash'}\\n    on:action={(e) => handleContextMenuAction(e.detail)}\\n    on:close={() => contextMenuVisible = false}\\n/>\\n\\n<UploadProgress \\n    uploads={$uploads}\\n    on:cancel={(e) => console.log('Cancel upload:', e.detail)}\\n/>\\n\\n<ConfirmDialog\\n    bind:open={showDeleteDialog}\\n    title={$t('deleteItem')}\\n    message={$t('deleteConfirmation')}\\n    confirmText={$t('delete')}\\n    type=\\"danger\\"\\n    on:confirm={confirmDelete}\\n/>\\n\\n<RenameDialog\\n    bind:open={showRenameDialog}\\n    item={itemToRename}\\n    on:rename={(e) => confirmRename(e.detail)}\\n/>\\n\\n<CreateFolderDialog\\n    bind:open={showCreateFolderDialog}\\n    on:create={(e) => console.log('Create folder:', e.detail)}\\n/>\\n\\n<!-- Hidden file inputs -->\\n<input \\n    type=\\"file\\" \\n    bind:this={fileInput}\\n    on:change={(e) => handleUpload(Array.from(e.target.files))}\\n    multiple \\n    style=\\"display: none;\\"\\n/>\\n\\n<input \\n    type=\\"file\\" \\n    bind:this={folderInput}\\n    on:change={(e) => handleUpload(Array.from(e.target.files))}\\n    webkitdirectory\\n    style=\\"display: none;\\"\\n/>\\n\\n<style>\\n    @import '$lib/styles/main.css';\\n    \\n    .main {\\n        display: flex;\\n        height: calc(100vh - 64px);\\n    }\\n    \\n    .content {\\n        flex: 1;\\n        display: flex;\\n        flex-direction: column;\\n        overflow: hidden;\\n    }\\n</style>\\n"],"names":[],"mappings":"AA+RI,QAAQ,sBAAsB,CAE9B,mBAAM,CACF,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,KAAK,KAAK,CAAC,CAAC,CAAC,IAAI,CAC7B,CAEA,sBAAS,CACL,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,QAAQ,CAAE,MACd"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  let $fileManager, $$unsubscribe_fileManager;
  let $$unsubscribe_currentUser;
  let $$unsubscribe_isAuthenticated;
  let $selectedCount, $$unsubscribe_selectedCount;
  let $sortedFiles, $$unsubscribe_sortedFiles;
  let $uploads, $$unsubscribe_uploads;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_fileManager = subscribe(fileManager, (value) => $fileManager = value);
  $$unsubscribe_currentUser = subscribe(currentUser, (value) => value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => value);
  $$unsubscribe_selectedCount = subscribe(selectedCount, (value) => $selectedCount = value);
  $$unsubscribe_sortedFiles = subscribe(sortedFiles, (value) => $sortedFiles = value);
  $$unsubscribe_uploads = subscribe(uploads, (value) => $uploads = value);
  let contextMenuVisible = false;
  let contextMenuX = 0;
  let contextMenuY = 0;
  let contextMenuItem = null;
  let showDeleteDialog = false;
  let showRenameDialog = false;
  let showCreateFolderDialog = false;
  let itemToRename = null;
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-1lrs79j_START -->${$$result.title = `<title>CloudCore Drive</title>`, ""}<!-- HEAD_svelte-1lrs79j_END -->`, ""} ${validate_component(NotificationContainer, "NotificationContainer").$$render($$result, {}, {}, {})} ${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <div class="main svelte-l2hcqo">${validate_component(Sidebar, "Sidebar").$$render(
      $$result,
      {
        currentSection: $fileManager.currentSection
      },
      {},
      {}
    )} <div class="content svelte-l2hcqo">${validate_component(Breadcrumbs, "Breadcrumbs").$$render(
      $$result,
      {
        path: $fileManager.breadcrumbPath,
        isTrashView: $fileManager.currentSection === "trash"
      },
      {},
      {}
    )} ${validate_component(Toolbar, "Toolbar").$$render(
      $$result,
      {
        selectedCount: $selectedCount,
        isTrashView: $fileManager.currentSection === "trash"
      },
      {},
      {}
    )} ${validate_component(FileList, "FileList").$$render(
      $$result,
      {
        files: $sortedFiles,
        isLoading: $fileManager.isLoading,
        isTrashView: $fileManager.currentSection === "trash",
        selectedItems: $fileManager.selectedItems
      },
      {
        selectedItems: ($$value) => {
          $fileManager.selectedItems = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div></div> ${validate_component(ContextMenu, "ContextMenu").$$render(
      $$result,
      {
        visible: contextMenuVisible,
        x: contextMenuX,
        y: contextMenuY,
        item: contextMenuItem,
        isTrashView: $fileManager.currentSection === "trash"
      },
      {},
      {}
    )} ${validate_component(UploadProgress, "UploadProgress").$$render($$result, { uploads: $uploads }, {}, {})} ${validate_component(ConfirmDialog, "ConfirmDialog").$$render(
      $$result,
      {
        title: $t("deleteItem"),
        message: $t("deleteConfirmation"),
        confirmText: $t("delete"),
        type: "danger",
        open: showDeleteDialog
      },
      {
        open: ($$value) => {
          showDeleteDialog = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(RenameDialog, "RenameDialog").$$render(
      $$result,
      {
        item: itemToRename,
        open: showRenameDialog
      },
      {
        open: ($$value) => {
          showRenameDialog = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(CreateFolderDialog, "CreateFolderDialog").$$render(
      $$result,
      { open: showCreateFolderDialog },
      {
        open: ($$value) => {
          showCreateFolderDialog = $$value;
          $$settled = false;
        }
      },
      {}
    )}  <input type="file" multiple style="display: none;"> <input type="file" webkitdirectory style="display: none;">`;
  } while (!$$settled);
  $$unsubscribe_t();
  $$unsubscribe_fileManager();
  $$unsubscribe_currentUser();
  $$unsubscribe_isAuthenticated();
  $$unsubscribe_selectedCount();
  $$unsubscribe_sortedFiles();
  $$unsubscribe_uploads();
  return $$rendered;
});
export {
  Page as default
};
