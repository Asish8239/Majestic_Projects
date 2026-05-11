#!/usr/bin/env python3
"""
Test script for the Majestic Projects API
"""
import requests
import json

def test_generate_endpoint():
    """Test the /generate endpoint"""
    url = "http://localhost:8000/generate"
    
    payload = {
        "domain": "AI",
        "difficulty": "Intermediate", 
        "purpose": "Academic",
        "output_type": "Full Project"
    }
    
    print("🧪 Testing /generate endpoint...")
    print(f"📤 Request: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SUCCESS! Generated project:")
            print(f"   Title: {data.get('title', 'N/A')}")
            print(f"   Domain: {data.get('domain', 'N/A')}")
            print(f"   Tech Stack: {data.get('tech_stack', [])}")
            return True
        else:
            print(f"❌ FAILED! Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

def test_health_endpoint():
    """Test the /health endpoint"""
    url = "http://localhost:8000/health"
    
    print("🧪 Testing /health endpoint...")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
            return True
        else:
            print(f"❌ Health check failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Starting API tests...\n")
    
    # Test health endpoint first
    health_ok = test_health_endpoint()
    print()
    
    # Test generate endpoint
    generate_ok = test_generate_endpoint()
    print()
    
    if health_ok and generate_ok:
        print("🎉 ALL TESTS PASSED! API is working correctly.")
    else:
        print("⚠️ Some tests failed. Check the output above.")