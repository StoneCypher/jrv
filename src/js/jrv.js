
class JRV {

    constructor(comp = (() => true), onchange) {
        console.log('construction');
        this.dirty          = true;
        this.comp           = comp;
        this.change_handler = onchange;
        this.callbacks      = [];
        this.update();
    }

    dirty_descendants() {
        console.log('dirtying descendants');
        this.callbacks.map(cb => cb());
    }

    flag_dirty() {
        console.log('flagging dirty');
        this.dirty = true;
        if (this.change_handler) { console.log('forcing update: ch'); this.update(); } else { console.log('no force'); }
        this.dirty_descendants();
        return this;
    }

    should_notify(cb) {
        this.callbacks = this.callbacks.concat(cb);
    }

    needs(Dep) {
        if (Array.isArray(Dep)) { Dep.map(d => d.should_notify(this.make_notifier())); }
        else                    { Dep.should_notify(this.make_notifier()); }
        return this;
    }

    make_notifier() {
        return (() => { console.log('notifier fired'); return this.flag_dirty(); });
    }

    onchange(newOnChange) {
        this.change_handler = newOnChange;
        return this;
    }

    set v(newComp) {
        this.comp = newComp;
        this.update();
    }

    get v() {
        if (this.dirty) { this.update(); }
        return this.value;
    }

    update() {

        console.log('updating');

        var compIsFunc = (typeof this.comp  === 'function'),
            valIsObj   = (typeof this.value === 'object'),
            oldVal     = valIsObj? NaN : this.value;  // because NaN === NaN is false, so nothing .comp() returns will match NaN // because Javascript is gross

        this.dirty = false;

        this.value = (compIsFunc? (console.log('  comp'), this.comp()) : (console.log('  store'), this.comp));

        if (this.value !== oldVal) {
            console.log('  calling change handler');
            this.change_handler? this.change_handler(this.value, oldVal) : true;
        } else {
            console.log('  not calling change handler');
        }

        console.log('  update is dirtying descendants');
        this.dirty_descendants();

        return this.value;

    }

}
