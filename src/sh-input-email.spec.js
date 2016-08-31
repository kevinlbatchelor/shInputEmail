var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react/lib/ReactTestUtils');
var _ = require('lodash');

var ShInputEmail = require('./sh-input-email').default;

describe('ShInputEmail', function() {
    it('handles label', function() {
        let value = '';
        let root = TestUtils.renderIntoDocument(<ShInputEmail label="test1" value={value} />);
        let rootNode = ReactDOM.findDOMNode(root);
        let input = rootNode.getElementsByTagName('input')[0];

        expect(root).not.toBeNull();
        expect(rootNode.innerHTML).toContain('test1');

        ReactDOM.unmountComponentAtNode(rootNode.parentNode);
    });

    it('set proper placeholder non-required', function() {
        let value = '';
        let root = TestUtils.renderIntoDocument(<ShInputEmail label="test1" value={value} />);
        let rootNode = ReactDOM.findDOMNode(root);
        let input = rootNode.getElementsByTagName('input')[0];

        expect(input.getAttribute('placeholder')).toBe('+');

        TestUtils.Simulate.focus(input);
        expect(input.getAttribute('placeholder')).toBe('');

        TestUtils.Simulate.blur(input);
        expect(input.getAttribute('placeholder')).toBe('+');

        TestUtils.Simulate.change(input);
    });

    it('validates non-required', function() {
        let value = '';
        let root = TestUtils.renderIntoDocument(<ShInputEmail label="test1" value={value} />);
        let rootNode = ReactDOM.findDOMNode(root);
        let input = rootNode.getElementsByTagName('input')[0];

        expect(input.value).toBe('');
        expect(rootNode.classList).toContain('sh-valid');
        expect(rootNode.classList).not.toContain('sh-invalid');
        expect(rootNode.classList).not.toContain('sh-touched');
        expect(rootNode.classList).toContain('sh-untouched');

        root.componentWillReceiveProps({value: 'asdf'});
        expect(input.value).toBe('asdf');
        expect(rootNode.classList).not.toContain('sh-valid');
        expect(rootNode.classList).toContain('sh-invalid');
        expect(rootNode.classList).not.toContain('sh-touched');
        expect(rootNode.classList).toContain('sh-untouched');

        TestUtils.Simulate.focus(input);
        expect(input.value).toBe('asdf');
        expect(rootNode.classList).not.toContain('sh-valid');
        expect(rootNode.classList).toContain('sh-invalid');
        expect(rootNode.classList).toContain('sh-touched');
        expect(rootNode.classList).not.toContain('sh-untouched');

        root.componentWillReceiveProps({value: 'a@a.com'});
        expect(input.value).toBe('a@a.com');
        expect(rootNode.classList).toContain('sh-valid');
        expect(rootNode.classList).not.toContain('sh-invalid');
        expect(rootNode.classList).toContain('sh-touched');
        expect(rootNode.classList).not.toContain('sh-untouched');
    });

    it('set proper placeholder required', function() {
        let value = '';
        let root = TestUtils.renderIntoDocument(<ShInputEmail label="test1" value={value} required />);
        let rootNode = ReactDOM.findDOMNode(root);
        let input = rootNode.getElementsByTagName('input')[0];

        expect(input.getAttribute('placeholder')).toContain('Required');

        TestUtils.Simulate.focus(input);
        expect(input.getAttribute('placeholder')).toBe('');

        TestUtils.Simulate.blur(input);
        expect(input.getAttribute('placeholder')).toContain('Required');
    });

    it('validates required', function() {
        let value = '';
        let root = TestUtils.renderIntoDocument(<ShInputEmail label="test1" value={value} required />);
        let rootNode = ReactDOM.findDOMNode(root);
        let input = rootNode.getElementsByTagName('input')[0];

        expect(input.value).toBe('');
        expect(rootNode.classList).not.toContain('sh-valid');
        expect(rootNode.classList).toContain('sh-invalid');
        expect(rootNode.classList).not.toContain('sh-touched');
        expect(rootNode.classList).toContain('sh-untouched');

        root.componentWillReceiveProps({value: 'asdf'});
        expect(input.value).toBe('asdf');
        expect(rootNode.classList).not.toContain('sh-valid');
        expect(rootNode.classList).toContain('sh-invalid');
        expect(rootNode.classList).not.toContain('sh-touched');
        expect(rootNode.classList).toContain('sh-untouched');

        TestUtils.Simulate.focus(input);
        expect(input.value).toBe('asdf');
        expect(rootNode.classList).not.toContain('sh-valid');
        expect(rootNode.classList).toContain('sh-invalid');
        expect(rootNode.classList).toContain('sh-touched');
        expect(rootNode.classList).not.toContain('sh-untouched');

        root.componentWillReceiveProps({value: 'a@a.com'});
        expect(input.value).toBe('a@a.com');
        expect(rootNode.classList).toContain('sh-valid');
        expect(rootNode.classList).not.toContain('sh-invalid');
        expect(rootNode.classList).toContain('sh-touched');
        expect(rootNode.classList).not.toContain('sh-untouched');
    });

    it('should extend onFocus', function() {
        let value = '';
        let focus = false;
        let handle = () => {focus = true};
        let root = TestUtils.renderIntoDocument(<ShInputEmail label="test1" value={value} onFocus={handle} />);
        let rootNode = ReactDOM.findDOMNode(root);
        let input = rootNode.getElementsByTagName('input')[0];

        expect(focus).toBeFalsy();

        TestUtils.Simulate.focus(input);
        expect(focus).toBeTruthy();
    });

    it('should extend onBlur', function() {
        let value = '';
        let blur = false;
        let handle = () => {blur = true};
        let root = TestUtils.renderIntoDocument(<ShInputEmail label="test1" value={value} onBlur={handle} />);
        let rootNode = ReactDOM.findDOMNode(root);
        let input = rootNode.getElementsByTagName('input')[0];

        expect(blur).toBeFalsy();

        TestUtils.Simulate.blur(input);
        expect(blur).toBeTruthy();
    });

    it('should extend onChange', function() {
        let value = '';
        let change = false;
        let handle = () => {change = true};
        let root = TestUtils.renderIntoDocument(<ShInputEmail label="test1" value={value} onChange={handle} />);
        let rootNode = ReactDOM.findDOMNode(root);
        let input = rootNode.getElementsByTagName('input')[0];

        expect(change).toBeFalsy();

        TestUtils.Simulate.change(input);
        expect(change).toBeTruthy();
    });

    it('should validate emails', function() {
        let value = '';
        let root = TestUtils.renderIntoDocument(<ShInputEmail value={value} />);

        expect(root.isValidEmail()).toBeFalsy();
        expect(root.isValidEmail(null)).toBeFalsy();
        expect(root.isValidEmail(0)).toBeFalsy();
        expect(root.isValidEmail(1)).toBeFalsy();
        expect(root.isValidEmail('')).toBeFalsy();
        expect(root.isValidEmail({})).toBeFalsy();
        expect(root.isValidEmail([])).toBeFalsy();

        expect(root.isValidEmail(' ')).toBeFalsy();
        expect(root.isValidEmail('a')).toBeFalsy();
        expect(root.isValidEmail('a@a')).toBeFalsy();
        expect(root.isValidEmail('@.')).toBeFalsy();
        expect(root.isValidEmail('a@.a')).toBeFalsy();
        expect(root.isValidEmail('a@a.')).toBeFalsy();

        expect(root.isValidEmail('a@a.a')).toBeTruthy();
        expect(root.isValidEmail('a.a@a.a')).toBeTruthy();
        expect(root.isValidEmail('a-a@a.a')).toBeTruthy();
        expect(root.isValidEmail('a+a@a.a')).toBeTruthy();
    });

    it('should handle a validator', function() {
        let value = '';

        let validator = {
            register: _.noop,
            unregister: _.noop,
            validate: _.noop
        };

        spyOn(validator, 'register');
        spyOn(validator, 'unregister');
        spyOn(validator, 'validate');
        let root = TestUtils.renderIntoDocument(<ShInputEmail label="test1" value={value} validator={validator} />);

        expect(validator.register).toHaveBeenCalled();
        expect(validator.unregister).not.toHaveBeenCalled();
        expect(validator.validate).not.toHaveBeenCalled();

        root.validateAll();
        expect(validator.validate).toHaveBeenCalled();

        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(root).parentNode);
        expect(validator.unregister).toHaveBeenCalled();
    });

});
