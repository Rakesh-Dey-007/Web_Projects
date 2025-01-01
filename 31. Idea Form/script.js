"use strict";
window.addEventListener("DOMContentLoaded", () => {
    const ideaForm = new IdeaForm("#idea");
});
class IdeaForm {
    /**
     * @param el CSS selector of the form
     */
    constructor(el) {
        var _a, _b, _c;
        /** Timeout function for submission */
        this.timeout = 0;
        this._idea = "";
        this._expanded = false;
        this._state = SubmitState.Default;
        this.form = document.querySelector(el);
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.toggle.bind(this));
        (_b = this.form) === null || _b === void 0 ? void 0 : _b.addEventListener("input", this.ideaUpdate.bind(this));
        (_c = this.form) === null || _c === void 0 ? void 0 : _c.addEventListener("submit", this.ideaSubmit.bind(this));
        document.addEventListener("click", this.outsideToCollapse.bind(this));
        document.addEventListener("keydown", this.escToCollapse.bind(this));
    }
    get idea() {
        return this._idea;
    }
    set idea(value) {
        var _a;
        this._idea = value;
        const submitBtn = (_a = this.form) === null || _a === void 0 ? void 0 : _a.querySelector("[type=submit]");
        if (submitBtn) {
            submitBtn.disabled = value.length === 0;
        }
    }
    get expanded() {
        return this._expanded;
    }
    set expanded(value) {
        var _a;
        this._expanded = value;
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.setAttribute("data-expanded", `${value}`);
    }
    get state() {
        return this._state;
    }
    set state(value) {
        var _a, _b;
        this._state = value;
        const textarea = (_a = this.form) === null || _a === void 0 ? void 0 : _a.querySelector("#my-idea");
        const submitBtn = (_b = this.form) === null || _b === void 0 ? void 0 : _b.querySelector("[type=submit]");
        if (textarea) {
            textarea.disabled = value !== SubmitState.Default;
        }
        if (submitBtn) {
            if (value === SubmitState.Sending) {
                submitBtn.textContent = Label.Sending;
                submitBtn.disabled = true;
            }
            else if (value === SubmitState.Done) {
                submitBtn.textContent = Label.Sent;
            }
            else {
                submitBtn.textContent = Label.Submit;
            }
        }
    }
    /**
     * Click outside the form to collapse.
     * @param e Click event
     * */
    outsideToCollapse(e) {
        if (this.state !== SubmitState.Default)
            return;
        let parent = e.target;
        while (parent !== null) {
            if (parent === this.form) {
                return;
            }
            parent = parent.parentElement;
        }
        this.expanded = false;
    }
    /**
     * Hide the form by pressing Esc.
     * @param e Keyboard event
     * */
    escToCollapse(e) {
        if (e.code === "Escape" && this.state === SubmitState.Default) {
            this.expanded = false;
        }
    }
    /**
     * Show or hide the form.
     * @param e Click event
     * */
    toggle(e) {
        var _a;
        const button = e.target;
        if (button.hasAttribute("data-toggle")) {
            this.expanded = !this.expanded;
            if (this.expanded) {
                const textarea = (_a = this.form) === null || _a === void 0 ? void 0 : _a.querySelector("#my-idea");
                textarea === null || textarea === void 0 ? void 0 : textarea.focus();
            }
        }
    }
    /**
     * Submit the idea content.
     * @param e Submit event
     * */
    async ideaSubmit(e) {
        e.preventDefault();
        if (this.state !== SubmitState.Default)
            return;
        const delaySending = 1000;
        const delayDone = 600;
        const delayReset = 300;
        this.state = SubmitState.Sending;
        return await new Promise(resolve => {
            // send
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                resolve();
            }, delaySending);
        }).then(async () => {
            // submitted
            this.state = SubmitState.Done;
            return await new Promise(resolve => {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    resolve();
                }, delayDone);
            });
        }).then(() => {
            // collapse and reset
            this.expanded = false;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                var _a;
                (_a = this.form) === null || _a === void 0 ? void 0 : _a.reset();
                this.idea = "";
                this.state = SubmitState.Default;
            }, delayReset);
        });
    }
    /**
     * Update the idea content internally.
     * @param e Input event
     * */
    ideaUpdate(e) {
        const textarea = e.target;
        this.idea = textarea.value;
    }
}
var Label;
(function (Label) {
    Label["Sending"] = "Sending\u2026";
    Label["Sent"] = "Sent";
    Label["Submit"] = "Submit";
})(Label || (Label = {}));
var SubmitState;
(function (SubmitState) {
    SubmitState[SubmitState["Default"] = 0] = "Default";
    SubmitState[SubmitState["Sending"] = 1] = "Sending";
    SubmitState[SubmitState["Done"] = 2] = "Done";
})(SubmitState || (SubmitState = {}));
