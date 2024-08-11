const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { performance } = require("perf_hooks");
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");
const session = require("express-session");

const app = express();
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Configuração do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para analisar o corpo das solicitações
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuração de sessão
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Variável global para armazenar o usuário
let globalUser = null;

// Middleware para recuperar o usuário autenticado
app.use(async (req, res, next) => {
  const token = req.cookies.authToken;

  if (token) {
    const userOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const fetch = (await import("node-fetch")).default;
      const userResponse = await fetch(
        "https://back-end-cori-cases.opatj4.easypanel.host/user",
        userOptions
      );

      if (userResponse.status === 200) {
        const userData = await userResponse.json();
        globalUser = userData; // Armazena o usuário globalmente
        req.user = userData; // Armazena o usuário na requisição
        req.session.user = userData; // Armazena o usuário na sessão
      } else {
        globalUser = null;
        req.user = null;
        req.session.user = null; // Limpa a sessão do usuário
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      globalUser = null;
      req.user = null;
      req.session.user = null; // Limpa a sessão do usuário
    }
  } else {
    globalUser = null;
    req.user = null;
    req.session.user = null; // Limpa a sessão do usuário
  }
  next();
});

// Middleware para medir latência
app.use((req, res, next) => {
  req.start = performance.now();
  res.on("finish", () => {
    const end = performance.now();
    const latency = end - req.start;
  });
  next();
});

// Middleware para medir tempo de resposta da API
function measureResponseTime(routeName, description) {
  return (req, res, next) => {
    const start = performance.now();
    res.on("finish", () => {
      const end = performance.now();
      const responseTime = end - start;
    });
    next();
  };
}

// Rota que serve o userLogin.ejs como resposta para '/'
app.get(
  "/",
  measureResponseTime("/", "Serve the user login page"),
  (req, res) => {
    if (req.user) {
      // Redirect to the index page if the user is authenticated
      res.render("index", { user: req.user });
    } else {
      // Render the login page if the user is not authenticated
      res.render("userLogin");
    }
  }
);

// Rota GET para renderizar a página novaTurma
app.get(
  "/novaTurma",
  measureResponseTime("/novaTurma", "Render the new class page"),
  (req, res) => {
    const user = req.user || {}; // Obtém o usuário autenticado, ou um objeto vazio
    res.render("novaTurma", { user });
  }
);

// Rota para processar a criação de uma nova turma
app.post(
  "/novaTurma",
  measureResponseTime("/novaTurma", "Process the creation of a new class"),
  async (req, res) => {
    const { pin } = req.body;
    const token = req.cookies.authToken;

    if (!token) {
      return res.redirect("/?error=No%20token%20found");
    }

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: pin }),
    };

    const fetchWithTimeout = async (url, options, timeout = 5000) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      options.signal = controller.signal;

      try {
        const response = await fetch(url, options);
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    };

    try {
      const fetch = (await import("node-fetch")).default;
      const response = await fetchWithTimeout(
        "https://back-end-cori-cases.opatj4.easypanel.host/classes/attribute",
        options
      );

      const responseBody = await response.text();

      if (response.status !== 200) {
        console.error("Enrollment response error:", responseBody);
        return res.redirect("/novaTurmaErro");
      }

      // Invalidar a cache após a inscrição em uma nova turma
      const cacheKey = `turmas_${globalUser.uuid}`;
      cache.del(cacheKey);

      res.redirect("/turmas");
    } catch (err) {
      console.error("Error enrolling in class:", err);
      res.redirect("/novaTurmaErro");
    }
  }
);

app.get(
  "/novaTurmaErro",
  measureResponseTime("/novaTurmaErro", "Render the new class error page"),
  (req, res) => {
    const user = req.user || {}; // Obtém o usuário autenticado, ou um objeto vazio
    res.render("novaTurmaErro", {
      user,
      error:
        "An error occurred while enrolling in the class. Please try again.",
    });
  }
);

// Rota para autenticação do usuário
app.post(
  "/login",
  measureResponseTime("/login", "Authenticate the user"),
  async (req, res) => {
    const { email, password } = req.body;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    };

    try {
      const fetch = (await import("node-fetch")).default;

      const response = await fetch(
        "https://back-end-cori-cases.opatj4.easypanel.host/user/login",
        options
      );

      const data = await response.json(); // Obtém a resposta como JSON

      if (response.ok && data) {
        const token = data; // Supondo que o token é retornado diretamente

        res.cookie("authToken", token, { httpOnly: true, secure: true });

        res.redirect("/index");
      } else {
        res.redirect("/?error=Invalid%20login%20credentials");
      }
    } catch (err) {
      console.error("Error:", err);
      res.redirect("/?error=An%20error%20occurred");
    }
  }
);

// Rota para renderizar a página principal do usuário autenticado
app.get(
  "/index",
  measureResponseTime("/index", "Render the authenticated user's main page"),
  (req, res) => {
    if (!globalUser) {
      return res.redirect("/?error=No%20user%20found");
    }

    res.render("index", { user: globalUser });
  }
);

// Rota para listar turmas do usuário
app.get(
  "/turmas",
  measureResponseTime("/turmas", "List the user's classes"),
  async (req, res) => {
    if (!globalUser) {
      return res.redirect("/?error=No%20user%20found");
    }

    const cacheKey = `turmas_${globalUser.uuid}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.render("turmas", { user: globalUser, turmas: cachedData });
    }

    try {
      const fetch = (await import("node-fetch")).default;
      const token = req.cookies.authToken;

      if (!token) {
        console.error("No token found");
        return res.redirect("/?error=No%20token%20found");
      }

      const userOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const userResponse = await fetch(
        "https://back-end-cori-cases.opatj4.easypanel.host/user",
        userOptions
      );

      if (userResponse.status !== 200) {
        const errorText = await userResponse.text();
        console.error("User response error:", errorText);
        throw new Error(`API responded with status ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      // console.log("User Data:", JSON.stringify(userData, null, 2));
      if (userData.class && Array.isArray(userData.class)) {
        const turmas = userData.class.map((c) => {
          const turma = c.class;
          const imageUrl = `https://back-end-cori-cases.opatj4.easypanel.host/uploads/${turma.image}`;
          return {
            id: turma.id,
            name: turma.name,
            imageUrl: imageUrl,
            description: turma.subject,
            code: turma.code, // Adiciona o código da turma
          };
        });

        cache.set(cacheKey, turmas);

        res.render("turmas", { user: globalUser, turmas });
      } else {
        console.error("Estrutura dos dados de turma inválida");
        res.redirect("/?error=Invalid%20class%20data%20structure");
      }
    } catch (err) {
      console.error("Error fetching classes data:", err);
      res.redirect("/?error=An%20error%20occurred%20fetching%20classes%20data");
    }
  }
);

// Rota para renderizar o dashboard do usuário
app.get(
  "/dashboard",
  measureResponseTime("/dashboard", "Render the user's dashboard"),
  (req, res) => {
    if (!globalUser) {
      return res.redirect("/?error=No%20user%20found");
    }
    res.render("dashboard", { user: globalUser });
  }
);

// Rota para listar puzzles do usuário filtrados pela turma
app.get(
  "/puzzles",
  measureResponseTime("/puzzles", "List the user's puzzles"),
  async (req, res) => {
    if (!globalUser) {
      console.error("No global user found");
      return res.redirect("/?error=No%20user%20found");
    }

    try {
      const fetch = (await import("node-fetch")).default;
      const token = req.cookies.authToken;

      if (!token) {
        console.error("No token found");
        return res.redirect("/?error=No%20token%20found");
      }

      const puzzleOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const puzzleResponse = await fetch(
        "https://back-end-cori-cases.opatj4.easypanel.host/puzzles/find",
        puzzleOptions
      );

      if (puzzleResponse.status !== 200) {
        const errorText = await puzzleResponse.text();
        console.error("Puzzles response error:", errorText);
        throw new Error(`API responded with status ${puzzleResponse.status}`);
      }

      const puzzlesData = await puzzleResponse.json();

      // Filtrar os puzzles para incluir apenas aqueles das turmas em que o usuário está matriculado
      const userClasses = globalUser.class.map((c) => c.classId);
      const filteredPuzzles = puzzlesData.filter((puzzle) =>
        userClasses.includes(puzzle.classId)
      );

      const className = req.query.className || "";

      res.render("puzzles", {
        user: globalUser,
        puzzles: filteredPuzzles,
        classes: globalUser.class,
        className: className,
      });
    } catch (err) {
      console.error("Error fetching puzzles data:", err);
      res.redirect("/?error=An%20error%20occurred%20fetching%20puzzles%20data");
    }
  }
);

// Rota para listar casos
app.get(
  "/casos",
  measureResponseTime("/casos", "List the user's cases"),
  async (req, res) => {
    if (!globalUser) {
      return res.redirect("/?error=No%20user%20found");
    }

    const cacheKey = `casos_${globalUser.uuid}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.render("casos", {
        user: globalUser,
        classes: globalUser.class,
        cases: cachedData,
      });
    }

    try {
      const fetch = (await import("node-fetch")).default;
      const token = req.cookies.authToken;

      if (!token) {
        return res.redirect("/?error=No%20token%20found");
      }

      const classOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const classResponse = await fetch(
        "https://back-end-cori-cases.opatj4.easypanel.host/classes",
        classOptions
      );

      if (classResponse.status !== 200) {
        const errorText = await classResponse.text();
        console.error("Classes response error:", errorText);
        throw new Error(`API responded with status ${classResponse.status}`);
      }

      const classesData = await classResponse.json();

      const casesOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const casesResponse = await fetch(
        "https://back-end-cori-cases.opatj4.easypanel.host/cases/all",
        casesOptions
      );

      if (casesResponse.status !== 200) {
        const errorText = await casesResponse.text();
        console.error("Cases response error:", errorText);
        throw new Error(`API responded with status ${casesResponse.status}`);
      }

      const casesData = await casesResponse.json();

      cache.set(cacheKey, casesData);

      res.render("casos", {
        user: globalUser,
        classes: globalUser.class,
        cases: casesData,
      });
    } catch (err) {
      console.error("Error fetching classes and cases data:", err);
      res.redirect(
        "/?error=An%20error%20occurred%20fetching%20classes%20and%20cases%20data"
      );
    }
  }
);

// Rota para responder puzzles
app.get(
  "/puzzleResposta/:uuid",
  measureResponseTime(
    "/puzzleResposta/:uuid",
    "Render the user's puzzle response page"
  ),
  async (req, res) => {
    const puzzleUuid = req.params.uuid;

    if (!globalUser) {
      return res.redirect("/?error=No%20user%20found");
    }

    try {
      const fetch = (await import("node-fetch")).default;
      const token = req.cookies.authToken;

      if (!token) {
        return res.redirect("/?error=No%20token%20found");
      }

      const puzzleOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const puzzleResponse = await fetch(
        `https://back-end-cori-cases.opatj4.easypanel.host/puzzles/find/${puzzleUuid}`,
        puzzleOptions
      );

      if (puzzleResponse.status !== 200) {
        const errorText = await puzzleResponse.text();
        console.error("Puzzle response error:", errorText);
        throw new Error(`API responded with status ${puzzleResponse.status}`);
      }

      const puzzleData = await puzzleResponse.json();

      if (puzzleData.questions && puzzleData.questions.length > 0) {
        puzzleData.questions.forEach((question, qIndex) => {
          if (question.alternatives && question.alternatives.length > 0) {
            question.alternatives.forEach((alternative, altIndex) => {});
          }
        });
      }

      res.render("puzzleResposta", { user: globalUser, puzzle: puzzleData });
    } catch (err) {
      console.error("Error fetching puzzle data:", err);
      res.redirect("/?error=An%20error%20occurred%20fetching%20puzzle%20data");
    }
  }
);

// Rota para responder casos específicos
app.get(
  "/casoResposta/:caseUuid",
  measureResponseTime(
    "/casoResposta/:caseUuid",
    "Render the user's case response page"
  ),
  async (req, res) => {
    const { caseUuid } = req.params;

    if (!globalUser) {
      console.error("No global user found");
      return res.redirect("/?error=No%20user%20found");
    }

    const cacheKey = `casoResposta_${caseUuid}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.render("casoResposta", {
        user: globalUser,
        caseData: cachedData.caseData,
        tags: cachedData.tags,
      });
    }

    try {
      const fetch = (await import("node-fetch")).default;
      const token = req.cookies.authToken;

      if (!token) {
        console.error("No token found");
        return res.redirect("/?error=No%20token%20found");
      }

      const caseOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const caseResponse = await fetch(
        `https://back-end-cori-cases.opatj4.easypanel.host/cases/${caseUuid}`,
        caseOptions
      );

      if (caseResponse.status !== 200) {
        const errorText = await caseResponse.text();
        console.error("Case response error:", errorText);
        throw new Error(`API responded with status ${caseResponse.status}`);
      }

      const caseData = await caseResponse.json();
      const tags = caseData.tags.map((tagObj) => tagObj.tags.name);

      console.log("Caso Data:", JSON.stringify(caseData, null, 2));
      res.render("casoResposta", {
        user: globalUser,
        caseData,
        tags,
      });
    } catch (err) {
      console.error("Error fetching case data:", err);
      res.redirect("/?error=An%20error%20occurred%20fetching%20case%20data");
    }
  }
);
app.post("/api/submitResponses/:caseUuid", async (req, res) => {
  const { caseUuid } = req.params;
  const { responses } = req.body;
  const user = req.user;

  if (!user) {
    console.error("No authenticated user found");
    return res.redirect("/?error=No%20user%20found");
  }

  if (!responses) {
    console.error("No responses received");
    return res.redirect("/?error=No%20responses%20received");
  }

  let parsedResponses;
  try {
    parsedResponses = JSON.parse(responses);
  } catch (error) {
    console.error("Error parsing responses:", error);
    return res.redirect("/?error=Invalid%20responses%20format");
  }

  // Prepare data for the API request
  const requestData = {};
  Object.keys(parsedResponses).forEach((tag) => {
    if (parsedResponses[tag]) {
      requestData[tag] = {
        answers: parsedResponses[tag],
        averageTipsUsed: 1, // or calculate the average if needed
      };
    }
  });

  // Log the request data being sent to the API

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.cookies.authToken}`,
    },
    body: JSON.stringify(requestData),
  };

  try {
    const fetch = (await import("node-fetch")).default;

    // Fetch the case data using the caseUuid
    const caseResponse = await fetch(
      `https://back-end-cori-cases.opatj4.easypanel.host/cases/${caseUuid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.cookies.authToken}`,
        },
      }
    );

    if (caseResponse.status !== 200) {
      const errorText = await caseResponse.text();
      console.error("Case response error:", errorText);
      return res.redirect("/?error=Case%20data%20fetch%20error");
    }

    const caseData = await caseResponse.json();

    const response = await fetch(
      `https://back-end-cori-cases.opatj4.easypanel.host/cases/answer/${caseUuid}`,
      options
    );

    if (response.status !== 200) {
      const errorText = await response.text();
      console.error("API response error:", errorText);
      return res.redirect("/?error=API%20response%20error");
    }

    const responseData = await response.json();

    //console.log("User Data:", JSON.stringify(responseData, null, 2));
    res.render("respostaAluno", {
      user: globalUser,
      responseData: responseData,
      caseData: caseData,
      responses: parsedResponses, // Pass parsedResponses to the template
    });
  } catch (err) {
    console.error("Error submitting responses:", err);
    res.redirect("/?error=An%20error%20occurred%20submitting%20responses");
  }
});

app.post("/classes/students/remove", async (req, res) => {
  const { classCode } = req.body;

  if (!classCode) {
    console.error("No class code provided");
    return res.status(400).send("No class code provided");
  }

  const token = req.cookies.authToken;

  if (!token) {
    console.error("No token found");
    return res.redirect("/?error=No%20token%20found");
  }

  const deleteOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(
      `https://back-end-cori-cases.opatj4.easypanel.host/classes/students/${classCode}`,
      deleteOptions
    );

    if (response.status !== 200) {
      const errorText = await response.text();
      console.error("Delete response error:", errorText);
      throw new Error(`API responded with status ${response.status}`);
    }

    // Invalidate the cache for the user's classes
    const cacheKey = `turmas_${globalUser.uuid}`;
    cache.del(cacheKey);

    res.redirect("/turmas");
  } catch (err) {
    console.error("Error removing class:", err);
    res.redirect("/?error=An%20error%20occurred%20removing%20the%20class");
  }
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
