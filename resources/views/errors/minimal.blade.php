<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>@yield('title')</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            font-family: "Kanit", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            color: #fff;
            background: radial-gradient(circle at top, #1f252c 0%, #111418 56%, #0c0f12 100%);
        }

        #notfound {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px 18px;
        }

        .notfound {
            position: relative;
            width: min(100%, 900px);
            text-align: center;
            padding: 28px 22px;
            border-radius: 0;
            background: transparent;
            border: 0;
            box-shadow: none;
        }

        .notfound-404 {
            position: relative;
            height: clamp(160px, 23vw, 220px);
            margin-bottom: 12px;
        }

        .notfound-404 h1 {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            margin: 0;
            font-size: clamp(110px, 26vw, 220px);
            font-weight: 800;
            line-height: 1;
            letter-spacing: 12px;
            color: #e07a74;
            text-shadow: 0 12px 30px rgba(224, 122, 116, 0.22);
        }

        .notfound h2 {
            margin: 0 0 14px;
            font-size: clamp(22px, 3vw, 34px);
            font-weight: 700;
            color: #f4ede8;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }

        .notfound p {
            margin: 0 auto;
            max-width: 650px;
            font-size: 16px;
            line-height: 1.7;
            color: #d8c3b3;
        }

        .notfound-button {
            margin-top: 18px;
            padding: 12px 24px;
            border: 1px solid rgba(224, 122, 116, 0.75);
            border-radius: 999px;
            background: linear-gradient(135deg, #222a32 0%, #1a2027 100%);
            color: #f4ede8;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.03em;
            cursor: pointer;
            transition: transform .18s ease, box-shadow .2s ease, filter .2s ease;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.28);
        }

        .notfound-button:hover {
            transform: translateY(-1px);
            filter: brightness(1.06);
            border-color: #e07a74;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.34);
        }

        .notfound-button:active {
            transform: translateY(0);
            box-shadow: 0 7px 14px rgba(0, 0, 0, 0.24);
        }

        .notfound-button:focus-visible {
            outline: 2px solid #e0c4af;
            outline-offset: 3px;
        }

        .notfound p a {
            color: #ef6b66;
            font-weight: 700;
            text-decoration: none;
            border-bottom: 1px dashed rgba(239, 107, 102, 0.65);
        }

        .notfound p a:hover {
            color: #ff8a84;
            border-bottom-color: #ff8a84;
        }

        .notfound-social {
            margin-top: 24px;
            display: flex;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .notfound-social a {
            width: 42px;
            height: 42px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: #fff;
            background: #1e2329;
            border: 1px solid rgba(224, 196, 175, 0.22);
            font-size: 14px;
            font-weight: 700;
            transition: transform .18s ease, background .2s ease, border-color .2s ease;
        }

        .notfound-social a:hover {
            transform: translateY(-1px);
            background: #ef6b66;
            border-color: #ef6b66;
        }

        @media (max-width: 640px) {
            .notfound {
                padding: 24px 12px;
            }

            .notfound-404 {
                height: 150px;
                margin-bottom: 8px;
            }

            .notfound-404 h1 {
                letter-spacing: 6px;
            }

            .notfound p {
                font-size: 14px;
            }
        }
    </style>
</head>

<body>
    <div id="notfound">
        <div class="notfound">
            <div class="notfound-404">
                <h1>@yield('code')</h1>
            </div>

            <h2>@yield('message')</h2>
            <p>
                La página que estás buscando pudo ser eliminada, cambió de nombre o está temporalmente no disponible.
            </p>
            <button type="button" onclick="window.location.href='{{ url('/') }}'" class="notfound-button">Volver al
                inicio</button>
        </div>
    </div>
</body>

</html>
