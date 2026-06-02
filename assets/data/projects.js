// Add real screenshot paths and URLs here when project media is ready.
window.PORTFOLIO_PROJECTS = [
  {
    id: "ue5-individual-game",
    number: "01",
    title: "UE5 Individual Game Project",
    type: "Unreal Engine 5 / Third Person Action Game / Individual Project",
    discipline: "Gameplay Systems",
    summary:
      "A third person action game developed as a complete playable experience or vertical slice, with a clear gameplay flow, progression, UI, audio, and a completion condition.",
    description:
      "A third person action game developed in Unreal Engine 5 for the Individual Game Project coursework. The project is intended to be presented as a complete playable game or a vertical slice, with a clear gameplay flow, UI, audio, progression, and completion condition. This entry remains intentionally general while the final gameplay scope is being refined.",
    contributions: [
      "Third person character controller placeholder.",
      "Gameplay interaction system placeholder.",
      "Combat system placeholder.",
      "Enemy and boss encounter placeholder.",
      "UI and audio integration.",
      "Level design and progression.",
      "Technical feature linked to the critical literature review placeholder."
    ],
    highlights: [
      "Playable individual game project",
      "Complete game or vertical slice",
      "Clear gameplay flow",
      "UI and sound integration",
      "Tutorial support if needed",
      "Completion or win condition",
      "Literature review technical feature"
    ],
    technologies: [
      "Unreal Engine 5",
      "Blueprints",
      "Gameplay Systems",
      "UI",
      "Audio",
      "Level Design"
    ],
    images: [
      { src: "", label: "Gameplay screenshot placeholder" },
      { src: "", label: "Level or encounter screenshot placeholder" },
      { src: "", label: "UI screenshot placeholder" }
    ],
    links: [
      { label: "GitHub Source", href: "", placeholder: "GitHub link placeholder" },
      { label: "Playable Build", href: "", placeholder: "Playable executable placeholder" }
    ]
  },
  {
    id: "programming-algorithms",
    number: "02",
    title: "Programming and Fundamental Algorithms",
    type: "C++ / 2D Pixel Game / Gameplay Programming / Algorithms",
    discipline: "Gameplay Programming",
    summary:
      "A C++ 2D pixel game featuring a virtual camera, finite and infinite tile maps, enemy spawning, projectile combat, AOE attacks, item buffs, collision detection, and binary save/load support.",
    description:
      "A C++ pixel style 2D game developed using the GamesEngineeringBase framework. The player explores a tile based map, fights enemies, collects items, gains score, and survives for as long as possible. The project demonstrates object oriented programming, real-time game loop design, file I/O, gameplay logic, collision systems, and performance-aware implementation.",
    contributions: [
      "Implemented a 2D virtual camera system that converts world space to screen space.",
      "Added camera following logic so the viewport stays centred on the player.",
      "Implemented finite map boundary control and infinite map scrolling using modular arithmetic.",
      "Built a data driven tile map system that loads map data from external files.",
      "Implemented finite and infinite map modes.",
      "Designed NPC enemy spawning logic, including off-screen spawning and circular spawning around the player in infinite mode.",
      "Added multiple enemy types with different health, speed, appearance, and behaviour.",
      "Implemented difficulty scaling by reducing enemy spawn intervals over time.",
      "Implemented enemy movement towards the player using direction vectors and delta time.",
      "Added a stationary shooter enemy type that fires projectiles at the player.",
      "Built collision systems for hero vs enemy, hero vs terrain, projectile vs enemy, and enemy projectile vs hero.",
      "Used circular collision for smoother hero-enemy interaction and tile based blocking for terrain.",
      "Implemented automatic attack logic that targets the nearest enemy in range.",
      "Implemented an AOE attack system that selects enemies in range and prioritises high HP targets.",
      "Added item spawning and temporary buff effects.",
      "Implemented score, FPS display, bitmap font rendering, and game state display.",
      "Implemented a binary save/load system for hero state, enemy state, item state, map type, score, time, and game-over state.",
      "Tested performance in finite and infinite map modes, with stable real-time FPS."
    ],
    highlights: [
      "2D pixel game",
      "Virtual camera",
      "Infinite maps",
      "Enemy AI",
      "Projectile combat",
      "Save/load system"
    ],
    technologies: [
      "C++",
      "GamesEngineeringBase",
      "OOP",
      "Data Structures",
      "File I/O",
      "Visual Studio"
    ],
    images: [
      {
        src: "assets/images/projects/Programming and Fundamental Algorithms.png",
        label: "2D pixel game with tile map, enemies, projectiles, score, and FPS display"
      }
    ],
    links: [
      { label: "GitHub Source", href: "https://github.com/sdaday/courseworkGame", placeholder: "" }
    ]
  },
  {
    id: "directx12-graphics",
    number: "03",
    title: "DirectX 12 Computer Graphics",
    type: "C++ / DirectX 12 / Real-Time Graphics / FPS Prototype",
    discipline: "Real-Time Graphics",
    summary:
      "A DirectX 12 graphics and gameplay prototype featuring texture mapping, normal mapping, GPU instancing, FPS camera control, projectile combat, AABB collision, and stable high FPS performance.",
    description:
      "A DirectX 12 real-time graphics project that combines rendering features with a simple first person gameplay loop. The project includes textured and normal mapped objects, data driven level loading, alpha testing, GPU instancing, a first person camera, projectile shooting, enemy states, AABB collision, and a skydome.",
    contributions: [
      "Implemented texture loading using stbi and uploaded textures to GPU resources.",
      "Created shader resource views and descriptor heap based texture binding.",
      "Implemented normal mapping by converting texture samples from [0, 1] to [-1, 1] and evaluating lighting in tangent space.",
      "Added data driven level loading from text files using model type, position, rotation, and scale values.",
      "Implemented alpha testing for cutout textures to avoid sorting issues caused by transparency.",
      "Implemented GPU instancing for repeated tree geometry using shared mesh buffers and per-instance transform buffers.",
      "Implemented a first person camera using position, yaw, pitch, mouse input, and pitch clamping.",
      "Added projectile spawning from a camera space muzzle offset.",
      "Implemented enemy hit logic, health reduction, hit animation state, attack animation state, and enemy removal on death.",
      "Implemented AABB collision between player and static objects.",
      "Added a skydome rendered as a background.",
      "Evaluated real-time performance using frame time and FPS, maintaining around 239 to 240 FPS during testing."
    ],
    highlights: [
      "Real-time rendering",
      "Normal mapping",
      "GPU instancing",
      "First person camera",
      "AABB collision"
    ],
    technologies: [
      "C++",
      "DirectX 12",
      "HLSL",
      "Descriptor Heap",
      "Rendering Pipeline"
    ],
    images: [
      {
        src: "assets/images/projects/DirectX 12 Computer Graphics Project.png",
        label: "DirectX 12 first person scene"
      }
    ],
    links: [
      { label: "GitHub Source", href: "https://github.com/sdaday/CG_Assessment", placeholder: "" }
    ]
  },
  {
    id: "advanced-graphics",
    number: "04",
    title: "Advanced Computer Graphics",
    type: "C++ / Physically Based Rendering / Path Tracing / Global Illumination",
    discipline: "Offline Rendering",
    summary:
      "A C++ physically based renderer extending a path tracer with BVH acceleration, tile based multithreading, environment lighting, Open Image Denoise, BSDF materials, and Instant Radiosity.",
    description:
      "A C++ physically based renderer developed for Advanced Computer Graphics coursework. The project extends a base path tracer with acceleration, multithreading, environment lighting, denoising, material models, and an alternative light transport method based on Instant Radiosity.",
    contributions: [
      "Implemented a Bounding Volume Hierarchy to accelerate ray-scene intersection.",
      "Used AABB based BVH nodes to skip triangle groups during camera ray, bounce ray, and shadow ray intersection.",
      "Added tile based multithreaded rendering to improve CPU utilisation.",
      "Divided the film into 128 x 128 render tiles and used an atomic tile counter for worker thread scheduling.",
      "Implemented environment lighting using latitude-longitude environment maps.",
      "Built importance sampling for environment maps using luminance weighted by sin(theta).",
      "Added environment evaluation for rays that escape the scene.",
      "Integrated Intel Open Image Denoise to reduce Monte Carlo noise.",
      "Stored colour, albedo, and normal buffers for denoising.",
      "Implemented multiple BSDF based material models through a shared material interface.",
      "Supported diffuse, Oren-Nayar, mirror, glass, plastic, dielectric, conductor, and layered materials.",
      "Implemented Instant Radiosity using light tracing and Virtual Point Lights.",
      "Generated VPLs from light paths hitting non-specular surfaces.",
      "Gathered VPL contribution during camera rendering to approximate diffuse indirect illumination.",
      "Compared standard path tracing and Instant Radiosity under the same render time.",
      "Reflected on sampling limitations, VPL artifacts, regularisation, and future improvements."
    ],
    highlights: [
      "Path tracing",
      "BVH acceleration",
      "Multithreaded rendering",
      "Environment lighting",
      "Image denoising",
      "Instant Radiosity"
    ],
    technologies: [
      "C++",
      "Path Tracing",
      "BVH",
      "Multithreading",
      "Open Image Denoise",
      "BSDF Materials"
    ],
    images: [
      {
        src: "assets/images/projects/Advanced Computer Graphics Path Tracing.png",
        label: "Path Tracing"
      },
      {
        src: "assets/images/projects/Advanced Computer Graphics Light Traing.png",
        label: "Light Tracing"
      }
    ],
    links: [
      { label: "GitHub Source", href: "https://github.com/sdaday/ACG-Assessment", placeholder: "" }
    ]
  },
  {
    id: "games-engineering",
    number: "05",
    title: "Games Engineering",
    type: "C++ / CPU Rasterizer Optimisation / Networking / ImGui",
    discipline: "Systems Engineering",
    summary:
      "A C++ systems project combining CPU rasterizer optimisation, multithreaded rendering, screen space striping, triangle binning, and a WinSock + Dear ImGui online chat room.",
    description:
      "A Games Engineering coursework project split into two parts. The first part optimises a CPU rasterizer through single threaded optimisation and multithreaded rendering. The second part implements a networked chat room using WinSock TCP networking and Dear ImGui.",
    contributionGroups: [
      {
        title: "Part 1 / Rasterizer Optimisation",
        items: [
          "Optimised a baseline CPU rasterizer in two phases: single threaded optimisation and multithreaded rendering.",
          "Cached screen width and height to reduce repeated getter calls and conversions.",
          "Added a per-vertex transform cache so shared vertices are transformed once per frame rather than repeatedly inside triangle loops.",
          "Precomputed inverse triangle area to reduce divisions in the inner pixel loop.",
          "Replaced repeated barycentric cross product calculations with edge function based rasterization.",
          "Moved the depth test before expensive shading work to reduce wasted per-pixel computation.",
          "Normalised light direction once per triangle instead of once per pixel.",
          "Cached triangle bounds as integer values before entering the rasterization loop.",
          "Implemented screen space striping so each worker thread writes to its own framebuffer stripe.",
          "Used a fixed thread pool to avoid creating and joining threads every frame.",
          "Added triangle binning so each stripe only processes relevant triangles.",
          "Created a custom stress test scene to evaluate overdraw, geometry load, and workload imbalance.",
          "Compared baseline, optimised, and multithreaded performance across multiple scenes."
        ]
      },
      {
        title: "Part 2 / Online Chat Room",
        items: [
          "Implemented a C++ client-server chat room using WinSock TCP networking.",
          "Used a central server to handle multiple client connections.",
          "Used select based I/O multiplexing instead of one thread per connection.",
          "Designed a lightweight text based message protocol.",
          "Supported username registration, public broadcast messages, direct messages, and online user list updates.",
          "Implemented socket-to-username and username-to-socket mapping for message routing.",
          "Built an ImGui client interface with a public chat log, online user panel, and private DM windows.",
          "Added per-user DM windows with separate message histories.",
          "Added audio feedback for incoming public and private messages.",
          "Used event based client GUI updates for connection, disconnection, broadcast messages, DMs, errors, and user list changes."
        ]
      }
    ],
    highlights: [
      "CPU rasterizer",
      "Performance optimisation",
      "Multithreaded rendering",
      "Thread pool",
      "TCP chat room",
      "Private messaging"
    ],
    technologies: [
      "C++",
      "CPU Rasterizer",
      "Multithreading",
      "Thread Pool",
      "WinSock TCP",
      "Dear ImGui"
    ],
    images: [
      {
        src: "assets/images/projects/预览.png",
        label: "Rasterizer preview scene"
      },
      {
        src: "assets/images/projects/Games Engineering Original version.png",
        label: "Original rasterizer performance test"
      },
      {
        src: "assets/images/projects/Games Engineering Optimization version.png",
        label: "Single threaded optimised rasterizer performance test"
      },
      {
        src: "assets/images/projects/Games Engineering Multithreading version.png",
        label: "Multithreaded rasterizer performance test"
      },
      {
        src: "assets/images/projects/Games Engineering Chatroom.png",
        label: "Dear ImGui online chat room with public messages and private DM"
      }
    ],
    links: [
      { label: "Rasterizer Optimised", href: "https://github.com/sdaday/Rasterizer_op", placeholder: "" },
      { label: "Rasterizer Multithreaded", href: "https://github.com/sdaday/Rasterizer_MT", placeholder: "" },
      { label: "Chat Server", href: "https://github.com/sdaday/Server", placeholder: "" },
      { label: "ImGui Chat Client", href: "https://github.com/sdaday/imgui_examples", placeholder: "" }
    ]
  },
  {
    id: "ue5-environment-systems",
    number: "06",
    title: "Game Engine Design and Development",
    type: "Unreal Engine 5 / Environment Systems / Technical Art / Group Project",
    discipline: "Technical Art",
    summary:
      "An Unreal Engine 5 group game project where I contributed dynamic sky and weather logic, cloud setup, rain control, water shading, fog placement, and lighting adjustments.",
    description:
      "A game engine design and development project built in Unreal Engine 5. My personal contribution focused on dynamic sky, water, and fog systems. This entry presents the project as Unreal Engine technical art and environment systems work.",
    contributions: [
      "Implemented a dynamic sky system.",
      "Built weather switching logic.",
      "Created sunny and rainy weather states.",
      "Configured a 2D cloud setup.",
      "Configured a volumetric cloud setup.",
      "Added rain effect activation and control.",
      "Developed water shading.",
      "Implemented ripple normal blending.",
      "Worked on transparency and foam related material behaviour.",
      "Placed fog and shaped the atmosphere design.",
      "Adjusted lighting and post process settings.",
      "Implemented and debugged systems through Blueprints."
    ],
    highlights: [
      "Dynamic sky",
      "Weather switching",
      "Cloud systems",
      "Rain effect control",
      "Water shading",
      "Fog atmosphere"
    ],
    technologies: [
      "Unreal Engine 5",
      "Blueprints",
      "Niagara",
      "Lighting System"
    ],
    images: [
      {
        src: "assets/images/projects/GEDD_Rain Result.png",
        label: "Rain weather state during gameplay"
      },
      {
        src: "assets/images/projects/GEDD_Ocean Result.png",
        label: "Ocean material result during gameplay"
      },
      {
        src: "assets/images/projects/GEDD_VolumetricClouds Result.png",
        label: "Volumetric cloud result and material parameters"
      },
      {
        src: "assets/images/projects/GEDD_VolumetricFog Result.png",
        label: "Volumetric fog result during gameplay"
      },
      {
        src: "assets/images/projects/GEDD_Ocean BluePrints.png",
        label: "Ocean material graph"
      },
      {
        src: "assets/images/projects/GEDD_VolumetrocClouds BluePrints1.png",
        label: "Volumetric Clouds material graph 1"
      },
      {
        src: "assets/images/projects/GEDD_VolumetricClouds BluePringts.png",
        label: "Volumetric Clouds material graph 2"
      },
      {
        src: "assets/images/projects/GEDD_Rain BluePrints.png",
        label: "Rain Blueprint"
      },
      {
        src: "assets/images/projects/GEDD_VolumeticFog BluePrints.png",
        label: "Volumetric fog material graph"
      }
    ],
    links: [
      { label: "GitHub Source", href: "https://github.com/sdaday/GEDD_Level3", placeholder: "" }
    ]
  }
];
