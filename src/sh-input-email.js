import React from 'react';
import * as _ from 'lodash';
import sh from 'sh-core';

require('./sh-input-email.scss');

let getPlaceholder = (required) => {
    if (required) {
        return 'Required Field';
    } else {
        return '+';
    }
};

class ShInputEmail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value || '',
            statusValid: false,
            statusTouched: false,
            placeholder: getPlaceholder(props.required)
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);

        this.validate = this.validate.bind(this);
        this.validateAll = this.validateAll.bind(this);
    }

    componentWillMount() {
        if (this.props.validator) {
            this.props.validator.register(this, this.validate);
        } else {
            this.validate();
        }
    }

    componentWillReceiveProps(props) {
        if (!_.isUndefined(props.value) && !_.isEqual(props.value, this.state.value)) {
            this.setState({
                value: props.value
            }, this.validateAll);
        }
    }

    componentWillUnmount() {
        if (this.props.validator) {
            this.props.validator.unregister(this);
        }
    }

    handleChange(event) {
        this.setState({
            value: event.target.value,
            statusTouched: true
        }, this.validateAll);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    };

    handleFocus(event) {
        this.refs.input.select();

        this.setState({
            placeholder: '',
            statusTouched: true
        });

        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    }

    handleBlur() {
        this.setState({
            placeholder: getPlaceholder(this.props.required),
        });

        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    }

    isValidEmail(email = '') {
        var step0 = (email || '').toString();

        var step1 = step0.split('@');
        if (_.compact(step1).length != 2) {
            return false;
        }

        var step2 = step1[1].split('.');
        //noinspection RedundantIfStatementJS
        if (_.compact(step2).length != 2) {
            return false;
        }

        return true;
    }

    validate(onSubmit) {
        let rtn = {
            isValid: true
        };

        let value = _.trim(this.state.value);

        if (this.props.required && _.isEmpty(value)) {
            rtn = {
                isValid: false,
                msg: 'Required'
            };
        } else if (!_.isEmpty(value) && !this.isValidEmail(value)) {
            rtn = {
                isValid: false,
                msg: 'Invalid Email Address'
            };
        }

        this.setState({
            statusValid: rtn.isValid,
            statusTouched: onSubmit || this.state.statusTouched
        });

        return rtn;
    }

    validateAll() {
        if (this.props.validator) {
            this.props.validator.validate();
        } else {
            this.validate();
        }
    }

    render() {
        //noinspection JSUnusedLocalSymbols
        let {
            value,
            onFocus,
            onBlur,
            onChange,
            placeholder,
            type,
            classNames,
            label,
            required,
            validator,
            ...other
        } = this.props;

        let classes = {
            shInputEmail: true,
            empty: _.isEmpty(this.state.value),
            shValid: this.state.statusValid,
            shInvalid: !this.state.statusValid,
            shTouched: this.state.statusTouched,
            shUntouched: !this.state.statusTouched,
            other: classNames,
        };

        return (
            <div className={sh.getClassNames(classes)}>
                <label>
                    <span className="label">{this.props.label}</span>
                    <input ref="input"
                           className="sh-text-input"
                           type="text"
                           placeholder={this.state.placeholder}
                           onChange={this.handleChange}
                           onFocus={this.handleFocus}
                           onBlur={this.handleBlur}
                           value={this.state.value}
                           {...other}
                    />
                </label>
            </div>
        )
    }
}

ShInputEmail.propTypes = {
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func,
    required: React.PropTypes.bool,
    validator: React.PropTypes.object,
};

ShInputEmail.defaultProps = {
    label: '',
    onChange: null,
    required: false,
    validator: null,
};

export default ShInputEmail;
