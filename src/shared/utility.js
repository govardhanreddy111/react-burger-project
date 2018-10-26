export const updateObject = (oldObject, updatedProperties) =>{
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const checkValidity =(value,rules) =>{
    let isValid = false;
    if(!rules)
        return true;
    if(rules.required){
        isValid = value.trim() !== '';
    }
    if(rules.minLength){
        isValid = value.length >= rules.minLength && isValid;
    }
    if(rules.maxLength){
        isValid = value.length <= rules.maxLength && isValid;
    }
    if(rules.isEmail){
        const pattern = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            isValid = pattern.test(value) && isValid
    }
    if(rules.isNumeric){
        const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
    }
    return isValid;
}