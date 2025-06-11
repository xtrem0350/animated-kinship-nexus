
-- Table pour les personnes/membres de la famille
CREATE TABLE public.family_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE,
  death_date DATE,
  birth_place TEXT,
  current_location TEXT,
  occupation TEXT,
  phone_number TEXT,
  email TEXT,
  bio TEXT,
  profile_image_url TEXT,
  gender TEXT CHECK (gender IN ('homme', 'femme', 'autre')),
  added_by UUID REFERENCES auth.users(id),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les relations familiales
CREATE TABLE public.family_relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE,
  related_person_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('parent', 'enfant', 'conjoint', 'frere_soeur')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  added_by UUID REFERENCES auth.users(id),
  UNIQUE(person_id, related_person_id, relationship_type)
);

-- Table pour les médias familiaux
CREATE TABLE public.family_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video', 'document')),
  media_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  date_taken DATE,
  location TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les demandes d'ajout/modification (pour la modération)
CREATE TABLE public.family_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id),
  request_type TEXT NOT NULL CHECK (request_type IN ('add_member', 'add_relationship', 'edit_member', 'add_media')),
  target_member_id UUID REFERENCES public.family_members(id),
  request_data JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  review_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Table pour les profils utilisateurs étendus
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  family_member_id UUID REFERENCES public.family_members(id),
  display_name TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  can_add_members BOOLEAN DEFAULT false,
  can_verify_data BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour family_members (lecture publique, écriture pour utilisateurs connectés)
CREATE POLICY "Anyone can view family members"
  ON public.family_members FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert family members"
  ON public.family_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = added_by);

CREATE POLICY "Users can update members they added or if they're admin"
  ON public.family_members FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = added_by OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Politiques pour family_relationships
CREATE POLICY "Anyone can view relationships"
  ON public.family_relationships FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add relationships"
  ON public.family_relationships FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = added_by);

-- Politiques pour family_media
CREATE POLICY "Anyone can view media"
  ON public.family_media FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upload media"
  ON public.family_media FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- Politiques pour family_requests
CREATE POLICY "Users can view their own requests"
  ON public.family_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = requester_id);

CREATE POLICY "Admins can view all requests"
  ON public.family_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Authenticated users can create requests"
  ON public.family_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

-- Politiques pour user_profiles
CREATE POLICY "Users can view all profiles"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own profile"
  ON public.user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Fonction pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    'member'
  );
  RETURN new;
END;
$$;

-- Trigger pour créer automatiquement un profil utilisateur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

-- Triggers pour updated_at
CREATE TRIGGER handle_family_members_updated_at
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
