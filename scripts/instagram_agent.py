# scripts/instagram_agent.py
import sys
import json
import traceback
from instaloader import Instaloader, Profile, ProfileNotExistsException, ConnectionException
from typing import Dict, Optional
from openai import OpenAI
import time


def get_instagram_data(username: str, api_key: str) -> Dict:
    """Fetch Instagram data for a given username"""
    try:
        print(f"Fetching data for username: {username}", file=sys.stderr)

        # Initialize Instaloader with anonymous session and rate limiting
        L = Instaloader(
            max_connection_attempts=3,
            sleep=True,
            quiet=False,
            download_pictures=False,
            download_videos=False,
            download_video_thumbnails=False,
            download_geotags=False,
            download_comments=False,
            save_metadata=False
        )

        # Adiciona um pequeno delay para evitar rate limiting
        time.sleep(2)

        try:
            import random
            # Tenta obter o perfil
            profile = Profile.from_username(L.context, username)

            # Análise do GPT
            role = analyze_profile_with_gpt(profile.full_name, profile.biography, api_key)

            # Cria resultado com dados do perfil
            result = {
                "name": profile.full_name or username,
                "username": username,
                "bio": profile.biography or "",
                "followers": format_followers(profile.followers) if hasattr(profile, 'followers') else 'N/A',
                "role": role,
                "posts": profile.mediacount if hasattr(profile, 'mediacount') else 0,
                "profilePicture": "https://via.placeholder.com/150",  # URL de placeholder temporária
                "website": profile.external_url if hasattr(profile, 'external_url') and profile.external_url else None,
                "error": None
            }

            # Tenta obter a foto do perfil
            try:
                if hasattr(profile, 'profile_pic_url') and profile.profile_pic_url:
                    result["profilePicture"] = profile.profile_pic_url
            except:
                pass  # Mantém a URL de placeholder se der erro

            print(f"Successfully processed data for {username}", file=sys.stderr)
            return result

        except ProfileNotExistsException:
            print(f"Profile {username} does not exist", file=sys.stderr)
            return create_default_response(username, "Profile not found")

        except ConnectionException as e:
            print(f"Connection error: {str(e)}", file=sys.stderr)
            return create_default_response(username, "Instagram rate limit - Please try again later")

    except Exception as e:
        print(f"Error occurred: {str(e)}", file=sys.stderr)
        return create_default_response(username)


def create_default_response(username: str, error_msg: str = None) -> Dict:
    """Create a default response when Instagram data can't be fetched"""
    return {
        "name": username,
        "username": username,
        "bio": "Profile information not available",
        "followers": "N/A",
        "role": "Digital Influencer",
        "posts": 0,
        "profilePicture": "https://via.placeholder.com/150",  # URL de placeholder padrão
        "website": None,
        "error": error_msg
    }


def analyze_profile_with_gpt(name: str, bio: str, api_key: str) -> str:
    """Use GPT to analyze profile and determine role"""
    try:
        if not bio or not api_key:
            return "Digital Influencer"

        client = OpenAI(api_key=api_key.strip())

        prompt = f"""
        Based on this Instagram profile information:
        Name: {name}
        Bio: {bio}

        Determine their professional role and area of expertise in a concise way.
        Format the response as a professional title, focusing on their main area.
        Example formats:
        - "Senior Software Engineer | Tech Lead"
        - "Health & Wellness Coach | Nutrition Specialist"
        - "Digital Marketing Strategist | Content Creator"
        """

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system",
                     "content": "You are an expert at analyzing professional profiles and determining roles."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=100
            )

            role = response.choices[0].message.content.strip()
            return role if role else "Digital Influencer"

        except:
            return "Digital Influencer"

    except:
        return "Digital Influencer"


def format_followers(count: int) -> str:
    """Format follower count to human readable string"""
    if count >= 1_000_000:
        return f"{count / 1_000_000:.1f}M+"
    elif count >= 1_000:
        return f"{count / 1_000:.1f}K+"
    return str(count)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing required arguments. Need username and API key"}))
        sys.exit(1)

    username = sys.argv[1]
    api_key = sys.argv[2]
    result = get_instagram_data(username, api_key)

    # Garante que a resposta é sempre um JSON válido
    print(json.dumps(result))
    sys.exit(0)