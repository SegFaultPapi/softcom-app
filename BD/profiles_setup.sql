-- ============================================================
--  TABLA: profiles
--  Mapea email → rol de aplicación para usuarios de Privy.
--  Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  email  TEXT PRIMARY KEY,
  role   TEXT NOT NULL DEFAULT 'analyst'
    CHECK (role IN ('admin', 'gerente_cartera', 'analyst')),
  nombre TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
--  RLS: solo lectura pública; escritura solo desde el backend
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lectura_publica_profiles" ON public.profiles;

CREATE POLICY "lectura_publica_profiles"
  ON public.profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Solo el rol postgres/service_role puede insertar o modificar
-- (no se crea política de INSERT/UPDATE/DELETE para anon/authenticated)

-- ============================================================
--  USUARIOS INICIALES — ajusta los emails a los reales
-- ============================================================
INSERT INTO public.profiles (email, role, nombre) VALUES
  ('0xandres.rmdo@gmail.com',            'admin',          'Administrador'),
  ('0xandres.rmdo+gerente@gmail.com',    'gerente_cartera', 'Gerente de Cartera'),
  ('0xandres.rmdo+analyst@gmail.com',    'analyst',         'Analista')
ON CONFLICT (email) DO UPDATE
  SET role   = EXCLUDED.role,
      nombre = EXCLUDED.nombre;
