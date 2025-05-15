-- @block
BEGIN;

-- @block

CREATE TYPE status_sender AS ENUM ('user', 'ai');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');


CREATE TABLE IF NOT EXISTS public.user
(
    id bigint NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
    username text UNIQUE NOT NULL,
    password text NOT NULL,
    email text UNIQUE NOT NULL,
    phone_number text,
    gender gender_type,
    date_of_birth DATE,
    full_name text,
    already_verified BOOLEAN NOT NULL DEFAULT FALSE,
    profile_filled BOOLEAN NOT NULL DEFAULT FALSE,
    activation_token uuid UNIQUE DEFAULT gen_random_uuid(),
    forget_password_token uuid,  -- Define the column without UNIQUE first
    forget_password_expire TIMESTAMP not null default current_timestamp + interval '1 day',
    CONSTRAINT id_primary_user PRIMARY KEY (id),
    CONSTRAINT unique_forget_password_token UNIQUE (forget_password_token) -- Apply UNIQUE constraint correctly
);

CREATE TABLE IF NOT EXISTS public.chat_session
(
    id bigint NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
    user_id bigint NOT NULL,
    chat_title text NOT NULL,
    last_edited TIMESTAMP NOT NULL DEFAULT NOW(),
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT id_primary_chat_session  PRIMARY KEY (id),
    CONSTRAINT 
        fk_chat_session_user_id  FOREIGN KEY (user_id)
        REFERENCES public.user (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    
);

CREATE TABLE IF NOT EXISTS public.chat_logs
(
    fk_chat_id bigint NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    message text NOT NULL,
    ai_response text,
    CONSTRAINT id_primary_chat_logs  PRIMARY KEY (fk_chat_id, created_at),
    CONSTRAINT 
        fk_chat_logs_chat_id  FOREIGN KEY (fk_chat_id)
        REFERENCES public.chat_session (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    
);

CREATE TABLE IF NOT EXISTS public.journal_session
(
    id bigint NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
    user_id bigint NOT NULL,
    journal_title text NOT NULL,
    journal_body text NOT NULL,
    last_edited TIMESTAMP NOT NULL DEFAULT NOW(),
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    mood_level INTEGER DEFAULT 0,
    CONSTRAINT id_primary_journal_session  PRIMARY KEY (id),
    CONSTRAINT 
        fk_journal_session_user_id  FOREIGN KEY (user_id)
        REFERENCES public.user (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    
);

CREATE TABLE IF NOT EXISTS public.professional_contacts
(
    id bigint NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY,
    professional_name TEXT NOT NULL,
    contact_info text NOT NULL,
    speciality text NOT NULL,
    CONSTRAINT id_primary_professional_contacts  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_session
(
    id_user bigint NOT NULL,
    token uuid not null UNIQUE DEFAULT gen_random_uuid(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_used TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    CONSTRAINT id_primary_user_session  PRIMARY KEY (id_user, token, created_at),
    CONSTRAINT 
        fk_user_session_user_id  FOREIGN KEY (id_user)
        REFERENCES public.user (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- @block
COMMIT;

-- @block
ROLLBACK;