import { toast } from 'react-toastify';

export function toast_message(message, is_error) {
    if (is_error) {
        toast.error(message);
    } else {
        toast.success(message);
    }
}