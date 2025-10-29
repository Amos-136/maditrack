import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Input validation schema
const validateSignupInput = (data: any) => {
  const errors: string[] = [];

  // Full name validation
  if (!data.fullName || typeof data.fullName !== 'string') {
    errors.push('Nom complet requis');
  } else {
    const fullName = data.fullName.trim();
    if (fullName.length < 2 || fullName.length > 100) {
      errors.push('Le nom doit contenir entre 2 et 100 caractères');
    }
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(fullName)) {
      errors.push('Le nom contient des caractères invalides');
    }
  }

  // Organization name validation
  if (!data.organizationName || typeof data.organizationName !== 'string') {
    errors.push('Nom de l\'organisation requis');
  } else {
    const orgName = data.organizationName.trim();
    if (orgName.length < 2 || orgName.length > 200) {
      errors.push('Le nom de l\'organisation doit contenir entre 2 et 200 caractères');
    }
    if (!/^[a-zA-ZÀ-ÿ0-9\s.,'&-]+$/.test(orgName)) {
      errors.push('Le nom de l\'organisation contient des caractères invalides');
    }
  }

  // Email validation
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email requis');
  } else {
    const email = data.email.trim().toLowerCase();
    if (email.length > 255) {
      errors.push('L\'email ne peut pas dépasser 255 caractères');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email invalide');
    }
  }

  // Password validation
  if (!data.password || typeof data.password !== 'string') {
    errors.push('Mot de passe requis');
  } else {
    if (data.password.length < 8 || data.password.length > 100) {
      errors.push('Le mot de passe doit contenir entre 8 et 100 caractères');
    }
    if (!/[A-Z]/.test(data.password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    if (!/[a-z]/.test(data.password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }
    if (!/[0-9]/.test(data.password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
  }

  // Organization category validation
  const validCategories = ['hopital', 'clinique', 'pharmacie', 'particulier'];
  if (!data.organizationCategory || !validCategories.includes(data.organizationCategory)) {
    errors.push('Type d\'organisation invalide');
  }

  return errors;
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    // Validate input
    const validationErrors = validateSignupInput(requestData);
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation échouée', 
          details: validationErrors 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Extract and sanitize inputs
    const fullName = requestData.fullName.trim();
    const organizationName = requestData.organizationName.trim();
    const email = requestData.email.trim().toLowerCase();
    const password = requestData.password;
    const organizationCategory = requestData.organizationCategory;

    // Create admin client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Rate limiting check: Check if email already used for org creation recently
    const { data: existingOrgs, error: checkError } = await supabase
      .from('organizations')
      .select('created_at, email')
      .eq('email', email)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (checkError) {
      console.error('Error checking existing organizations:', checkError);
    } else if (existingOrgs && existingOrgs.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Un compte avec cet email a déjà été créé récemment. Veuillez réessayer plus tard.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 1. Create organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: organizationName,
        type: 'clinique_privee',
        category: organizationCategory,
        email: email
      })
      .select()
      .single();

    if (orgError || !orgData) {
      console.error('Organization creation error:', orgError);
      return new Response(
        JSON.stringify({ 
          error: 'Impossible de créer l\'organisation', 
          details: orgError?.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 2. Create user with organization_id in metadata
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email for faster onboarding
      user_metadata: {
        full_name: fullName,
        organization_id: orgData.id
      }
    });

    if (userError || !userData.user) {
      console.error('User creation error:', userError);
      
      // Rollback: Delete the organization if user creation fails
      await supabase.from('organizations').delete().eq('id', orgData.id);
      
      return new Response(
        JSON.stringify({ 
          error: 'Impossible de créer le compte utilisateur', 
          details: userError?.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Success
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Compte créé avec succès',
        user: {
          id: userData.user.id,
          email: userData.user.email
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur serveur inattendue',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
