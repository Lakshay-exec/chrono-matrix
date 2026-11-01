/**
 * Intelligence Shield to detect disposable & temporary email services
 */

const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  '10minutemail.net',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.biz',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'mailinator.com',
  'mailinator2.com',
  'mailin8r.com',
  'tempmail.com',
  'temp-mail.org',
  'temp-mail.io',
  'throwawaymail.com',
  'yopmail.com',
  'yopmail.fr',
  'cool.fr.nf',
  'jetable.fr.nf',
  'trashmail.com',
  'trashmail.net',
  'trashmail.me',
  'getnada.com',
  'aboymail.com',
  'dropmail.me',
  'dispostable.com',
  'fakeinbox.com',
  'crazymailing.com',
  'mytemp.email',
  'nada.ltd',
  'inboxkitten.com',
  'burnermail.io',
  'byom.de',
  'emailondeck.com',
  'mohmal.com',
  'generator.email',
  'fakemailgenerator.com',
  'minuteinbox.com',
  'tempail.com',
  'luxusmail.org',
  'cuvox.de',
  'dayrep.com',
  'einrot.com',
  'fleckens.hu',
  'gustr.com',
  'jourrapide.com',
  'rhyta.com',
  'superrito.com',
  'teleworm.us',
  'armyspy.com',
  'tutanota.com',
  'maildrop.cc',
  'inboxbear.com',
  'trashinbox.com',
  'chacuo.net',
  'mytempemail.com',
  'tmpmail.net',
  'tmpmail.org',
  'owlymail.com',
  'bupmail.com',
  'emkei.cz',
  'spambox.us',
  'mintemail.com',
  'deadfake.com',
  'mohmal.im',
  'mohmal.in',
  'tmail.ws',
  'boximail.com',
  'fakemail.net',
  'zillamail.com',
  'throwaway.email'
]);

export function isTemporaryEmail(email: string): { isTemp: boolean; reason?: string } {
  if (!email || !email.includes('@')) {
    return { isTemp: false };
  }

  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2) return { isTemp: true, reason: 'Invalid email syntax.' };

  const domain = parts[1];

  // Direct blacklist hit
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isTemp: true,
      reason: `The domain "@${domain}" is a detected temporary/disposable inbox provider. Please use a permanent email.`
    };
  }

  // Subdomain check (e.g., mail.10minutemail.com)
  for (const known of DISPOSABLE_DOMAINS) {
    if (domain.endsWith('.' + known)) {
      return {
        isTemp: true,
        reason: `Subdomain of disposable email provider detected (@${domain}). Please use a valid email.`
      };
    }
  }

  // Heuristics for typical disposable patterns
  const suspiciousKeywords = ['tempmail', 'disposable', 'throwaway', 'trashmail', 'fakemail', 'minuteinbox', 'tmpbox', 'guerrilla'];
  for (const keyword of suspiciousKeywords) {
    if (domain.includes(keyword)) {
      return {
        isTemp: true,
        reason: `Suspicious disposable keyword detected in "@${domain}". Please use a permanent email.`
      };
    }
  }

  return { isTemp: false };
}
