#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EDUKAD PRODUCTION API HEALTH CHECK & STABILITY DASHBOARD
Cinematic Terminal Dashboard with Real-time Probes
"""
import urllib.request
import urllib.error
import json
import time
import sys

BASE_URL = "https://edukad-backend.vercel.app/api"
FRONTEND_URL = "https://edukad.vercel.app"

# Override BASE_URL if --local flag is provided
if "--local" in sys.argv:
    BASE_URL = "http://localhost:4000/api"
    FRONTEND_URL = "http://localhost:3000"

# ANSI Colors & Styling
C_RESET   = "\033[0m"
C_BOLD    = "\033[1m"
C_DIM     = "\033[2m"
C_CYAN    = "\033[38;2;6;182;212m"
C_EMERALD = "\033[38;2;16;185;129m"
C_ROSE    = "\033[38;2;244;63;94m"
C_AMBER   = "\033[38;2;245;158;11m"
C_PURPLE  = "\033[38;2;168;85;247m"
C_GRAY    = "\033[38;2;148;163;184m"
C_WHITE   = "\033[38;2;255;255;255m"

def send(method, path, data=None, token=None, full_url=None):
    url = full_url if full_url else f"{BASE_URL}{path}"
    headers = {
        "User-Agent": "Edukad-HealthCheck/2.0",
        "Accept": "application/json"
    }
    if data is not None:
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
        
    encoded_data = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    
    t0 = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            latency = (time.perf_counter() - t0) * 1000
            body = res.read().decode("utf-8")
            try:
                parsed = json.loads(body)
            except Exception:
                parsed = body
            return res.status, latency, parsed
    except urllib.error.HTTPError as e:
        latency = (time.perf_counter() - t0) * 1000
        body = e.read().decode("utf-8")
        try:
            parsed = json.loads(body)
        except Exception:
            parsed = body
        return e.code, latency, parsed
    except Exception as e:
        latency = (time.perf_counter() - t0) * 1000
        return 0, latency, str(e)

def print_banner():
    banner = f"""{C_CYAN}
    ╔═══════════════════════════════════════════════════════════════════════════╗
    ║   ███████╗██████╗ ██╗   ██╗██╗  ██╗ █████╗ ██████╗                        ║
    ║   ██╔════╝██╔══██╗██║   ██║██║ ██╔╝██╔══██╗██╔══██╗                       ║
    ║   █████╗  ██║  ██║██║   ██║█████═╝ ███████║██║  ██║                       ║
    ║   ██╔══╝  ██║  ██║██║   ██║██╔═██╗ ██╔══██║██║  ██║                       ║
    ║   ███████╗██████╔╝╚██████╔╝██║ ╚██╗██║  ██║██████╔╝  PRODUCTION RUNTIME   ║
    ╚═══════════════════════════════════════════════════════════════════════════╝{C_RESET}
    {C_DIM}Target Platform:{C_RESET} {C_BOLD}{BASE_URL}{C_RESET} {C_DIM}| Vercel Serverless + Supabase PG{C_RESET}
    """
    for line in banner.split("\n"):
        print(line)
        time.sleep(0.01)

def stream_probe(category, method, endpoint, note, expected_status, req_data=None, token_val=None, full_url=None):
    category_label = f"{C_PURPLE}[{category.upper():^10}]{C_RESET}"
    method_label = f"{C_CYAN}{method:<6}{C_RESET}"
    endpoint_display = endpoint if endpoint else full_url
    print(f" {category_label} {method_label} {C_WHITE}{endpoint_display:<32}{C_RESET} {C_DIM}... probing{C_RESET}", end="\r", flush=True)

    status_code, latency, response = send(method, endpoint, data=req_data, token=token_val, full_url=full_url)
    
    passed = (status_code == expected_status) or (isinstance(expected_status, list) and status_code in expected_status)
    
    status_color = C_EMERALD if passed else C_ROSE
    status_icon = "PASS" if passed else "FAIL"
    badge = f"{status_color}{C_BOLD}[ {status_icon} {status_code} ]{C_RESET}"
    
    if latency < 350:
        lat_color = C_EMERALD
    elif latency < 1000:
        lat_color = C_AMBER
    else:
        lat_color = C_ROSE
        
    lat_text = f"{lat_color}{latency:6.1f}ms{C_RESET}"
    
    print(f" {category_label} {method_label} {C_WHITE}{endpoint_display:<32}{C_RESET} {badge}  {lat_text}  {C_DIM}— {note}{C_RESET}")
    return passed, latency, response

def main():
    print_banner()
    
    results = []
    jwt_token = None
    user_name = None

    print(f"\n{C_BOLD}{C_WHITE}--- INITIATING SYSTEM HEALTH PROBES ---{C_RESET}\n")

    # 1. Gateway Health Probe (Root serverless endpoint)
    # The root endpoint is at https://edukad-backend.vercel.app/ (without /api)
    root_url = BASE_URL.replace("/api", "") if BASE_URL.endswith("/api") else BASE_URL
    p1, l1, r1 = stream_probe("GATEWAY", "GET", "/", "Vercel Root Serverless Health", 200, full_url=f"{root_url}/")
    results.append(("Vercel Serverless Gateway", p1, l1))

    # 2. Authentication Login Probe
    login_payload = {
        "email": "alireza.azizpour@rokad.ir",
        "password": "Alireza@Rokad2026"
    }
    p2, l2, r2 = stream_probe("AUTH", "POST", "/auth/login", "Mentor Credentials Authentication", [200, 201], req_data=login_payload)
    results.append(("User Login (JWT Generation)", p2, l2))
    
    if p2 and isinstance(r2, dict) and "accessToken" in r2:
        jwt_token = r2["accessToken"]
        user_name = r2.get("user", {}).get("fullName", "کاربر")
        print(f"   {C_DIM}↳ Authenticated as: {C_EMERALD}{user_name}{C_RESET} {C_DIM}(Role: {r2.get('user', {}).get('role')}){C_RESET}")
    else:
        print(f"   {C_ROSE}↳ Warning: Login failed, subsequent protected routes may fail.{C_RESET}")

    # 3. Protected Profile Probe
    p3, l3, r3 = stream_probe("PROFILE", "GET", "/auth/me", "Verified Token Identity (/auth/me)", 200, token_val=jwt_token)
    results.append(("Token Verification & Identity", p3, l3))

    # 4. Roadmaps Core Catalog Probe
    p4, l4, r4 = stream_probe("ROADMAPS", "GET", "/roadmaps", "All Roadmaps Catalog", 200, token_val=jwt_token)
    results.append(("Roadmaps Catalog Query", p4, l4))
    if p4 and isinstance(r4, list):
        print(f"   {C_DIM}↳ Retrieved {C_CYAN}{len(r4)}{C_RESET} {C_DIM}active learning roadmaps from database{C_RESET}")

    # 5. Roadmap Details & Skill Graph
    sample_slug = "frontend-dev"
    p5, l5, r5 = stream_probe("GRAPH", "GET", f"/roadmaps/{sample_slug}", "Skill Tree & Nodes Graph", 200, token_val=jwt_token)
    results.append(("Skill Tree & Nodes Graph", p5, l5))
    if p5 and isinstance(r5, dict) and "nodes" in r5:
        node_count = len(r5["nodes"])
        print(f"   {C_DIM}↳ Graph '{sample_slug}' parsed: {C_CYAN}{node_count}{C_RESET} {C_DIM}nodes with prerequisites{C_RESET}")

    # 6. Student/Mentor Enrollments
    p6, l6, r6 = stream_probe("ENROLL", "GET", "/enrollments/my", "Current User Enrollments", 200, token_val=jwt_token)
    results.append(("Enrollments Data Access", p6, l6))

    # 7. Notifications Feed
    p7, l7, r7 = stream_probe("NOTIF", "GET", "/notifications", "Realtime Notifications Stream", 200, token_val=jwt_token)
    results.append(("Notifications Feed", p7, l7))

    # 8. Unread Counter
    p8, l8, r8 = stream_probe("NOTIF", "GET", "/notifications/unread-count", "Unread Notifications Counter", 200, token_val=jwt_token)
    results.append(("Unread Notifications Counter", p8, l8))

    # 9. Frontend Edge Application Probe
    p9, l9, r9 = stream_probe("FRONTEND", "GET", "", "Next.js 14 Frontend Edge Status", [200, 307, 308], full_url=FRONTEND_URL)
    results.append(("Frontend Application Availability", p9, l9))

    # Calculate metrics
    total = len(results)
    passed_count = sum(1 for _, p, _ in results)
    failed_count = total - passed_count
    latencies = [l for _, _, l in results]
    avg_latency = sum(latencies) / len(latencies) if latencies else 0
    min_latency = min(latencies) if latencies else 0
    max_latency = max(latencies) if latencies else 0
    stability = (passed_count / total) * 100

    # Print Scorecard
    print(f"\n{C_BOLD}{C_WHITE}═══════════════════════════════════════════════════════════════════════════{C_RESET}")
    print(f"{C_BOLD}{C_WHITE}                        SYSTEM STABILITY SCORECARD                         {C_RESET}")
    print(f"{C_BOLD}{C_WHITE}═══════════════════════════════════════════════════════════════════════════{C_RESET}")
    
    health_color = C_EMERALD if stability == 100 else (C_AMBER if stability >= 80 else C_ROSE)
    print(f" • Total Probes Executed : {C_BOLD}{total}{C_RESET}")
    print(f" • Successful Probes     : {C_EMERALD}{C_BOLD}{passed_count}{C_RESET}")
    print(f" • Failed Probes         : {C_ROSE if failed_count > 0 else C_GRAY}{C_BOLD}{failed_count}{C_RESET}")
    print(f" • Average Response Time : {C_CYAN}{C_BOLD}{avg_latency:.1f} ms{C_RESET} {C_DIM}(min: {min_latency:.1f}ms, max: {max_latency:.1f}ms){C_RESET}")
    print(f" • Platform Health Index : {health_color}{C_BOLD}{stability:.1f}%{C_RESET}")
    
    # Visual Progress Bar
    bar_length = 36
    filled = int((stability / 100) * bar_length)
    bar = f"{health_color}{'█' * filled}{C_GRAY}{'░' * (bar_length - filled)}{C_RESET}"
    print(f" • Overall Status        : [{bar}] {health_color}{C_BOLD}{'ALL SYSTEMS OPERATIONAL' if stability == 100 else 'ATTENTION REQUIRED'}{C_RESET}")
    print(f"{C_BOLD}{C_WHITE}═══════════════════════════════════════════════════════════════════════════{C_RESET}\n")

    sys.exit(0 if failed_count == 0 else 1)

if __name__ == "__main__":
    main()