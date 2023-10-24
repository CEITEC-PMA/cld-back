const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate");

const CandidatoSchema = new mongoose.Schema(
  {
    cpf: {
      type: String,
      unique: [true, "CPF já consta no banco"],
      required: [true, "não pode ficar vazio."],
    },
    nome: {
      type: String,
      required: [true, "não pode ficar vazio."],
    },
    telefone: {
      type: String,
      required: [true, "não pode ficar vazio."],
    },
    matricula: {
      type: Number,
    },
    // dt_nascimento: {
    //   type: Date,
    //   required: [true, "não pode ficar vazio"]
    // },
    // rg: {
    //   type: String,
    //   required: [true, "não pode ficar vazio."],
    // },
    cargo: {
      type: String,
      required: [true, "não pode ficar vazio."],
    },
    funcao: {
      type: String,
      required: [true, "não pode ficar vazio."],
    },
    aprovado: {
      type: String,
      default: "não",
    },
    justificativa: {
      type: String,
      default: "",
    },
    // graduacao: {
    //   type: Boolean,
    //   required: [true, "não pode ficar vazio."],
    // },
    // curso_graduacao: {
    //   type: String
    // },
    // pos_graduacao: {
    //   type: Boolean,
    //   required: [true, "não pode ficar vazio."],
    //   default: false
    // },
    // curso_pos_graduacao: {
    //   type: String
    // },
    // mestrado: {
    //   type: Boolean,
    //   required: [true, "não pode ficar vazio."],
    //   default: false
    // },
    // curso_mestrado: {
    //   type: String
    // },
    // doutorado: {
    //   type: Boolean,
    //   required: [true, "não pode ficar vazio."],
    //   default: false
    // },
    // curso_doutorado: {
    //   type: String
    // },
    curso_gestor: {
      type: String,
      required: [true, "não pode ficar vazio."],
      default: false,
    },
    obs_curso_gestor: {
      type: String,
    },
    // outros_cursos: {
    //   type: Boolean,
    //   default: false
    // },
    data_entrada_inst: {
      type: Date,
      required: [true, "não pode ficar vazio."],
    },
    data_entrada_docencia: {
      type: Date,
      required: [true, "não pode ficar vazio."],
    },
    tempo_modulacao: {
      type: String,
    },
    tempo_docencia: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "não pode ficar vazio."],
      match: [/\S+@\S+\.\S+/, "é inválido."],
    },
    // endereco: {
    //   type: {
    //     cep: { type: String, required: true },
    //     rua: { type: String, required: true },
    //     complemento: { type: String },
    //     cidade: { type: String, required: true },
    //     uf: { type: String, required: true },
    //     bairro: { type: String, required: true },
    //     numero: { type: String }
    //   },
    //   required: true
    // },
    foto: {
      type: Array,
      default: [],
    },
    protocolo: {
      type: String,
      //required: [true, "não pode ficar vazio."]
    },
    zona: {
      type: Schema.Types.ObjectId,
      ref: "Zona",
    },
    numero_candidato: {
      type: Number,
    },
    docs: {
      type: {
        doc_01: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_02: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_03: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_04: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_05: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_06: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_07: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_08: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_09: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_10: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_11: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_12: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_13: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_14: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_15: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_16: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_17: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_18: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_19: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_20: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
        doc_21: {
          type: {
            file: { type: String, required: true },
            original_file: { type: String, required: true },
          },
          default: {},
        },
      },
      default: {
        doc_01: { file: "", original_file: "" },
        doc_02: { file: "", original_file: "" },
        doc_03: { file: "", original_file: "" },
        doc_04: { file: "", original_file: "" },
        doc_05: { file: "", original_file: "" },
        doc_06: { file: "", original_file: "" },
        doc_07: { file: "", original_file: "" },
        doc_08: { file: "", original_file: "" },
        doc_09: { file: "", original_file: "" },
        doc_10: { file: "", original_file: "" },
        doc_11: { file: "", original_file: "" },
        doc_12: { file: "", original_file: "" },
        doc_13: { file: "", original_file: "" },
        doc_14: { file: "", original_file: "" },
        doc_15: { file: "", original_file: "" },
        doc_16: { file: "", original_file: "" },
        doc_17: { file: "", original_file: "" },
        doc_18: { file: "", original_file: "" },
        doc_19: { file: "", original_file: "" },
        doc_20: { file: "", original_file: "" },
        doc_21: { file: "", original_file: "" },
      },
    },

    deletado: {
      type: Boolean,
      required: [true, "não pode ficar vazio."],
      default: false,
    },
  },
  { timestamps: true },
  { collection: "candidato" }
);

CandidatoSchema.plugin(mongoosePaginate);
CandidatoSchema.plugin(uniqueValidator, { message: "já está sendo utilizado" });

module.exports = mongoose.model("Candidato", CandidatoSchema);
