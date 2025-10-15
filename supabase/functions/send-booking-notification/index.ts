import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { z } from "npm:zod@3.25.76";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation schemas (server-side protection)
const bookingSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255).toLowerCase(),
  phone: z.string().trim().max(20).regex(/^[0-9+\s\-().]*$/).optional().or(z.literal('')),
  event_type: z.enum(['mariage', 'anniversaire', 'soiree-privee', 'corporate', 'festival', 'autre']),
  event_date: z.string().optional().or(z.literal('')),
  guest_count: z.string().optional().or(z.literal('')),
  venue: z.string().trim().max(200).optional().or(z.literal('')),
  budget_range: z.string().optional().or(z.literal('')),
  message: z.string().trim().min(10).max(2000),
  type: z.literal('booking')
});

const quoteSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255).toLowerCase(),
  phone: z.string().trim().max(20).regex(/^[0-9+\s\-().]*$/).optional().or(z.literal('')),
  event_type: z.enum(['mariage', 'anniversaire', 'soiree-privee', 'corporate', 'festival', 'autre']),
  event_date: z.string().optional().or(z.literal('')),
  venue: z.string().trim().max(200).optional().or(z.literal('')),
  guest_count: z.string().optional().or(z.literal('')),
  duration_hours: z.string().optional().or(z.literal('')),
  special_requests: z.string().trim().max(1000).optional().or(z.literal('')),
  budget_range: z.string().optional().or(z.literal('')),
  message: z.string().trim().min(10).max(2000),
  type: z.literal('quote')
});

const notificationSchema = z.discriminatedUnion('type', [
  bookingSchema,
  quoteSchema
]);

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(identifier);
  
  if (!limit || now > limit.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + 3600000 }); // 1 hour
    return true;
  }
  
  if (limit.count >= 3) {
    return false;
  }
  
  limit.count++;
  return true;
}

interface NotificationRequest {
  name: string;
  email: string;
  phone?: string;
  event_type: string;
  event_date?: string;
  guest_count?: string;
  venue?: string;
  budget_range?: string;
  message: string;
  duration_hours?: string;
  special_requests?: string;
  type: 'booking' | 'quote';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // SERVER-SIDE VALIDATION (Critical Security Layer)
    const validationResult = notificationSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.format());
      return new Response(
        JSON.stringify({ 
          error: "Invalid request data",
          details: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    const validatedBody = validationResult.data;
    
    // RATE LIMITING (Prevent abuse)
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rateLimitKey = `${validatedBody.email}:${clientIP}`;

    if (!checkRateLimit(rateLimitKey)) {
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded",
          message: "Trop de demandes. Veuillez réessayer dans une heure."
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    console.log("Notification request received:", { type: validatedBody.type });

    const { name, email, phone, event_type, event_date, guest_count, venue, budget_range, message, duration_hours, special_requests, type } = validatedBody;

    // Format event type for display
    const eventTypeDisplay = {
      'mariage': 'Mariage',
      'anniversaire': 'Anniversaire',
      'soiree-privee': 'Soirée privée',
      'corporate': 'Événement corporate',
      'festival': 'Festival',
      'autre': 'Autre'
    }[event_type] || event_type;

    // Email HTML styles
    const htmlStyles = `
      <style>
        body { 
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
          background-color: #0A0A0A; 
          color: #FFFFFF; 
          margin: 0; 
          padding: 0; 
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%); 
          border: 1px solid rgba(212, 175, 55, 0.2); 
        }
        .header { 
          background: linear-gradient(135deg, #D4AF37 0%, #F4E5B5 100%); 
          padding: 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          color: #0A0A0A; 
          font-size: 28px; 
          font-weight: bold; 
        }
        .content { 
          padding: 40px 30px; 
        }
        .content h2 { 
          color: #D4AF37; 
          margin-top: 0; 
          margin-bottom: 20px; 
          font-size: 22px; 
        }
        .content p { 
          line-height: 1.6; 
          margin-bottom: 20px; 
          color: #FFFFFF; 
        }
        .details { 
          background: rgba(212, 175, 55, 0.05); 
          border-left: 4px solid #D4AF37; 
          padding: 20px; 
          margin: 20px 0; 
        }
        .details-row { 
          margin: 10px 0; 
          display: flex; 
          gap: 10px; 
        }
        .details-label { 
          color: #D4AF37; 
          font-weight: bold; 
          min-width: 150px; 
        }
        .details-value { 
          color: #FFFFFF; 
        }
        .footer { 
          background: #0A0A0A; 
          padding: 30px; 
          text-align: center; 
          border-top: 1px solid rgba(212, 175, 55, 0.2); 
        }
        .footer p { 
          margin: 5px 0; 
          color: #FFFFFF; 
          font-size: 14px; 
        }
        .footer a { 
          color: #D4AF37; 
          text-decoration: none; 
        }
        .cta-button { 
          display: inline-block; 
          background: linear-gradient(135deg, #D4AF37 0%, #F4E5B5 100%); 
          color: #0A0A0A; 
          padding: 15px 40px; 
          text-decoration: none; 
          border-radius: 4px; 
          font-weight: bold; 
          margin: 20px 0; 
        }
      </style>
    `;

    // Owner notification email (all details)
    const ownerSubject = type === 'booking' 
      ? `🎵 Nouvelle demande de réservation - ${name}`
      : `💼 Nouvelle demande de devis - ${name}`;

    const ownerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        ${htmlStyles}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DJ ANSELME</h1>
          </div>
          <div class="content">
            <h2>${type === 'booking' ? '🎵 Nouvelle Réservation' : '💼 Nouvelle Demande de Devis'}</h2>
            <p>Vous avez reçu une nouvelle demande ${type === 'booking' ? 'de réservation' : 'de devis'} via le site web.</p>
            
            <div class="details">
              <h3 style="color: #D4AF37; margin-top: 0;">Informations du client</h3>
              <div class="details-row">
                <span class="details-label">Nom :</span>
                <span class="details-value">${name}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Email :</span>
                <span class="details-value"><a href="mailto:${email}" style="color: #D4AF37;">${email}</a></span>
              </div>
              ${phone ? `
              <div class="details-row">
                <span class="details-label">Téléphone :</span>
                <span class="details-value"><a href="tel:${phone}" style="color: #D4AF37;">${phone}</a></span>
              </div>
              ` : ''}
            </div>

            <div class="details">
              <h3 style="color: #D4AF37; margin-top: 0;">Détails de l'événement</h3>
              <div class="details-row">
                <span class="details-label">Type d'événement :</span>
                <span class="details-value">${eventTypeDisplay}</span>
              </div>
              ${event_date ? `
              <div class="details-row">
                <span class="details-label">Date :</span>
                <span class="details-value">${new Date(event_date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              ` : ''}
              ${venue ? `
              <div class="details-row">
                <span class="details-label">Lieu :</span>
                <span class="details-value">${venue}</span>
              </div>
              ` : ''}
              ${guest_count ? `
              <div class="details-row">
                <span class="details-label">Nombre d'invités :</span>
                <span class="details-value">${guest_count} personnes</span>
              </div>
              ` : ''}
              ${duration_hours ? `
              <div class="details-row">
                <span class="details-label">Durée :</span>
                <span class="details-value">${duration_hours} heures</span>
              </div>
              ` : ''}
              ${budget_range ? `
              <div class="details-row">
                <span class="details-label">Budget :</span>
                <span class="details-value">${budget_range}</span>
              </div>
              ` : ''}
            </div>

            <div class="details">
              <h3 style="color: #D4AF37; margin-top: 0;">Message</h3>
              <p style="color: #FFFFFF; white-space: pre-wrap;">${message}</p>
            </div>

            ${special_requests ? `
            <div class="details">
              <h3 style="color: #D4AF37; margin-top: 0;">Demandes spéciales</h3>
              <p style="color: #FFFFFF; white-space: pre-wrap;">${special_requests}</p>
            </div>
            ` : ''}

            <p style="margin-top: 30px; color: #D4AF37; font-weight: bold;">
              ⚠️ Action requise : Répondre au client sous 24-48h
            </p>
          </div>
          <div class="footer">
            <p>DJ Anselme - Système de notifications</p>
            <p><a href="https://djanselme.com">djanselme.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Client confirmation email
    const clientSubject = type === 'booking'
      ? `✅ Confirmation de votre demande de réservation`
      : `✅ Confirmation de votre demande de devis`;

    const clientHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        ${htmlStyles}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DJ ANSELME</h1>
          </div>
          <div class="content">
            <h2>Bonjour ${name},</h2>
            <p>Merci pour votre ${type === 'booking' ? 'demande de réservation' : 'demande de devis'} !</p>
            <p>Votre message a bien été reçu et je vous recontacterai dans les <strong>24 à 48 heures</strong> pour discuter de votre projet.</p>
            
            <div class="details">
              <h3 style="color: #D4AF37; margin-top: 0;">Récapitulatif de votre demande</h3>
              <div class="details-row">
                <span class="details-label">Type d'événement :</span>
                <span class="details-value">${eventTypeDisplay}</span>
              </div>
              ${event_date ? `
              <div class="details-row">
                <span class="details-label">Date :</span>
                <span class="details-value">${new Date(event_date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              ` : ''}
              ${venue ? `
              <div class="details-row">
                <span class="details-label">Lieu :</span>
                <span class="details-value">${venue}</span>
              </div>
              ` : ''}
            </div>

            <p>En attendant, n'hésitez pas à :</p>
            <ul style="color: #FFFFFF; line-height: 1.8;">
              <li>Découvrir mes <a href="https://djanselme.com#music" style="color: #D4AF37;">derniers mixes</a></li>
              <li>Explorer mes <a href="https://djanselme.com#events" style="color: #D4AF37;">événements à venir</a></li>
              <li>Me contacter si vous avez des questions : <a href="mailto:info@djanselme.com" style="color: #D4AF37;">info@djanselme.com</a></li>
            </ul>

            <p style="margin-top: 30px; color: #D4AF37; font-weight: bold;">
              À très bientôt ! 🎵
            </p>
          </div>
          <div class="footer">
            <p><strong>DJ Anselme</strong></p>
            <p>📧 <a href="mailto:info@djanselme.com">info@djanselme.com</a></p>
            <p>🌐 <a href="https://djanselme.com">djanselme.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send owner notification
    console.log("Sending owner notification");
    const ownerEmailResponse = await resend.emails.send({
      from: "DJ Anselme <info@djanselme.com>",
      to: ["a.magaia@gmail.com"],
      subject: ownerSubject,
      html: ownerHtml,
    });

    if (ownerEmailResponse.error) {
      console.error("Error sending owner email:", ownerEmailResponse.error);
      throw ownerEmailResponse.error;
    }

    console.log("Owner email sent successfully:", { id: ownerEmailResponse.data?.id });

    // Send client confirmation
    console.log("Sending client confirmation");
    const clientEmailResponse = await resend.emails.send({
      from: "DJ Anselme <info@djanselme.com>",
      reply_to: "info@djanselme.com",
      to: [email],
      subject: clientSubject,
      html: clientHtml,
    });

    if (clientEmailResponse.error) {
      console.error("Error sending client email:", clientEmailResponse.error);
      throw clientEmailResponse.error;
    }

    console.log("Client email sent successfully:", { id: clientEmailResponse.data?.id });

    return new Response(
      JSON.stringify({ 
        success: true, 
        ownerEmailId: ownerEmailResponse.data?.id,
        clientEmailId: clientEmailResponse.data?.id 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-notification function:", {
      message: error.message,
      name: error.name
    });
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
