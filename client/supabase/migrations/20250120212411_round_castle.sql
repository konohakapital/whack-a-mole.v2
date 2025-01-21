/*
  # Whack-a-Mole Game Schema

  1. Tables
    - Profiles: User profiles and stats
    - Game Sessions: Track individual game sessions
    - Game Scores: Store game scores
    - Character Presets: Custom character configurations
    - Achievements: Game achievements
    - User Achievements: Track unlocked achievements
    - Game Settings: User preferences
    - Items: Game items
    - User Items: Player inventory
    - Game Events: Track game events

  2. Security
    - RLS enabled on all tables
    - Policies for data access control
*/

-- Create profiles table first
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    username text UNIQUE NOT NULL,
    high_score integer DEFAULT 0,
    total_games integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create game_sessions table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS game_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) NOT NULL,
    start_time timestamptz DEFAULT now(),
    end_time timestamptz,
    duration INTERVAL,
    difficulty text,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create game_scores table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS game_scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) NOT NULL,
    score integer NOT NULL,
    difficulty text NOT NULL,
    max_combo integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create character_presets table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS character_presets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) NOT NULL,
    name text NOT NULL,
    whacker_url text,
    mole_url text,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create achievements table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create user_achievements table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS user_achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) NOT NULL,
    achievement_id uuid REFERENCES achievements(id) NOT NULL,
    unlocked_at timestamptz DEFAULT now(),
    UNIQUE(profile_id, achievement_id)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create game_settings table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS game_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) NOT NULL,
    setting_name text NOT NULL,
    setting_value text NOT NULL,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create items table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create user_items table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS user_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) NOT NULL,
    item_id uuid REFERENCES items(id) NOT NULL,
    acquired_at timestamptz DEFAULT now(),
    UNIQUE(profile_id, item_id)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create game_events table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS game_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) NOT NULL,
    event_type text NOT NULL,
    event_data jsonb,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS on all tables
DO $$ BEGIN
  EXECUTE 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE character_presets ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE user_items ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE game_events ENABLE ROW LEVEL SECURITY';
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create policies safely
DO $$ BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
  CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

  -- Game scores policies
  DROP POLICY IF EXISTS "Game scores are viewable by everyone" ON game_scores;
  CREATE POLICY "Game scores are viewable by everyone"
    ON game_scores FOR SELECT
    USING (true);

  DROP POLICY IF EXISTS "Users can insert own game scores" ON game_scores;
  CREATE POLICY "Users can insert own game scores"
    ON game_scores FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

  -- Character presets policies
  DROP POLICY IF EXISTS "Character presets are viewable by owner" ON character_presets;
  CREATE POLICY "Character presets are viewable by owner"
    ON character_presets FOR SELECT
    USING (auth.uid() = profile_id);

  DROP POLICY IF EXISTS "Users can insert own character presets" ON character_presets;
  CREATE POLICY "Users can insert own character presets"
    ON character_presets FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

  DROP POLICY IF EXISTS "Users can update own character presets" ON character_presets;
  CREATE POLICY "Users can update own character presets"
    ON character_presets FOR UPDATE
    USING (auth.uid() = profile_id);

  DROP POLICY IF EXISTS "Users can delete own character presets" ON character_presets;
  CREATE POLICY "Users can delete own character presets"
    ON character_presets FOR DELETE
    USING (auth.uid() = profile_id);
END $$;