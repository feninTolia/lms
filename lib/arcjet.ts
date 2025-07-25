import 'server-only';

import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
} from '@arcjet/next';
import { env } from './env';

// Re-export the rules to simplify imports inside handlers
export {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
};

// Create a base Arcjet instance for use by each handler
export default arcjet({
  // Get your site key from https://app.arcjet.com
  // and set it as an environment variable rather than hard coding.
  // See: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
  key: env.ARCJET_KEY,
  // We specify a custom fingerprint so we can dynamically build it within each
  // demo route.
  characteristics: ['fingerprint'],
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection

    shield({ mode: 'LIVE' }),

    // Create a bot detection rule

    // detectBot({
    //   mode: 'LIVE', // Blocks requests. Use "DRY_RUN" to log only

    //   // Block all bots except the following

    //   allow: [
    //     'CATEGORY:SEARCH_ENGINE', // Google, Bing, etc

    //     // Uncomment to allow these other common bot categories

    //     // See the full list at https://arcjet.com/bot-list

    //     //"CATEGORY:MONITOR", // Uptime monitoring services

    //     //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
    //   ],
    // }),

    // Create a token bucket rate limit. Other algorithms are supported.

    // tokenBucket({
    //   mode: 'LIVE',

    //   refillRate: 5, // Refill 5 tokens per interval

    //   interval: 10, // Refill every 10 seconds

    //   capacity: 10, // Bucket capacity of 10 tokens
    // }),
  ],
});
