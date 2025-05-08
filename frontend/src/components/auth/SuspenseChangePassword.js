'use client'

import React, { Suspense} from 'react'
import ChangePasswordForm from './ChangePasswordForm'

function SuspenseChangePassword() {
    return (
        <Suspense>
            <ChangePasswordForm />
        </Suspense>
    )
}

export default SuspenseChangePassword