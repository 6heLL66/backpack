export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
    const date = new Date(dateString);
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return localDate.toLocaleDateString('en-US', mergedOptions);
    } catch (error) {
        console.error('Error formatting date:', error);
        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return localDate.toISOString().slice(0, 16).replace('T', ' ');
    }
};

export const formatDateShort = (dateString: string): string => {
    return formatDate(dateString, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDateLong = (dateString: string): string => {
    return formatDate(dateString, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

export const formatDateOnly = (dateString: string): string => {
    return formatDate(dateString, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatTimeOnly = (dateString: string): string => {
    return formatDate(dateString, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};
