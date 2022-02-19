- [x] Create simple and shitty authentication
- [x] Create configuration module
- [x] Config page on frontend
- [ ] Setup step by step on first run on frontend
- [ ] Check if encryption key is valid for keys in database.
- [x] Make token revoking system
- [ ] JWT REFRESHING!!!!
- [ ] Create proper user system with roles, permissions that will replace this shitty authentication
- [ ] More modular configuration. Modules should be able to register it's own config properties.
- [x] Domain management with Cloudflare
- [ ] Test and fix bugs in domain management ^^
- [x] Add proper error handling to CloudflareProvider and domain management
- [ ] Handle DNS records pagination correctly
- [ ] Make support for only 3 types or records - A, AAAA, CNAME. This project is not Cloudflare Dash replacement.
- [x] Domain management site on frontend (well almost)
- [ ] Cloudflare provider is not returning correct errors, like when record already exists. Need to fix that.
- [ ] Proxy management with Caddy
- [ ] Support for basic auth with Caddy
- [ ] Containers management using Portainer
- [ ] Proxmox integration

## Final
- [ ] Write tests
- [ ] Cache as much as you can
- [ ] Make user can add domains from different providers, not relying on global config. Rather config per domain/s.

### Optional
- [ ] Support for NGINX as Reverse Proxy
