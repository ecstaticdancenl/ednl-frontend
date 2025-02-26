import basepath from "@/lib/basepath";
import { useState } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

interface Values {
  email: string;
  name: string;
}

export function Footer() {
  return (
    <>
      <footer className={"bg-slate-900/50 w-full"}>
        <div
          className={
            "lg:px-10 sm:px-6 px-4 py-12 w-full max-w-(--breakpoint-2xl) mx-auto flex sm:flex-row flex-col items-center justify-between gap-4"
          }
        >
          <img src="/dancer3.svg" className={"w-12 hidden md:block"} alt="" />
          <div className={"text-left md:text-center flex flex-col gap-2"}>
            <h3>Ecstatic Dance Nieuwsbrief</h3>
            <p className={"text-sm max-w-prose mx-auto text-white/50"}>
              Je ontvangt updates over nieuwe organisaties en aankondigingen per
              seizoen over grotere evenementen (zoals festivals en retreats).
            </p>
            <Formik
              initialValues={{
                email: "",
                name: "",
              }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Ongeldig email adres")
                  .required("Kan niet leeg zijn"),
              })}
              onSubmit={async (
                values: Values,
                { setSubmitting, resetForm }: FormikHelpers<Values>
              ) => {
                if (values.name !== "") return;
                const mcUrl = `https://igniteme.us18.list-manage.com/subscribe/post?u=ab83cc07f755eeee1f8f01be5&id=ca9850a571&EMAIL=${encodeURIComponent(
                  values.email
                )}`;
                window.open(mcUrl, "_blank");
                resetForm();
                setSubmitting(false);
              }}
            >
              {({ errors, touched }) => (
                <Form
                  className={
                    "flex flex-col sm:flex-row gap-3 items-start md:items-center md:justify-center"
                  }
                >
                  <div className={"relative"}>
                    <Field
                      className="shadow-sm bg-white/10 rounded-md hover:bg-white/20 py-1.5 px-4 placeholder-white/50 transition-colors"
                      id="email"
                      name="email"
                      placeholder="Email"
                      type="email"
                    />
                    {errors.email && touched.email ? (
                      <div
                        className={
                          "text-rose-300 text-sm absolute w-full left-0 top-full text-left"
                        }
                      >
                        {errors.email}
                      </div>
                    ) : null}
                  </div>
                  <Field type={"text"} name={"name"} className={"ohnohoney"} />
                  <button
                    className="text-base rounded-md px-4 text-xs sm:text-sm py-2.5 bg-rose-600 uppercase font-bold tracking-very-wide hover:bg-rose-700"
                    type="submit"
                  >
                    Inschrijven
                  </button>
                </Form>
              )}
            </Formik>
          </div>
          <img
            src={basepath + "/dancer4.svg"}
            className={"-scale-x-100 w-14 hidden sm:block"}
            alt=""
          />
        </div>
      </footer>
      <footer
        className={
          "z-10 bg-slate-900 py-12 text-white font-light tracking-wider text-xs"
        }
      >
        <div className={"max-w-(--breakpoint-2xl) mx-auto "}>
          <div
            className={
              "lg:px-10 sm:px-6 px-4 md:grid md:grid-cols-3 flex flex-col-reverse gap-12 gap-6"
            }
          >
            <div>
              <h5>Achtergrond</h5>
              <div className={"mt-2"}>
                Deze is site is ontwikkeld zonder commercieel verdienmodel, uit
                liefde voor Ecstatic Dance.
                <br />♡
              </div>
            </div>
            <div className={"md:text-center"}>
              <h5>Dank</h5>
              <ul className={"mt-2"}>
                <li>
                  Hosting en beheer door{" "}
                  <a
                    href="https://igniteme.nl/"
                    target={"_blank"}
                    rel={"noreferrer"}
                  >
                    Ramon
                  </a>
                </li>
                <li>
                  Code door{" "}
                  <a
                    href="https://sefrijn.nl"
                    target={"_blank"}
                    rel={"noreferrer"}
                  >
                    Sefrijn
                  </a>{" "}
                  van{" "}
                  <a
                    href="https://howaboutyes.com"
                    target={"_blank"}
                    rel={"noreferrer"}
                  >
                    Studio How About Yes
                  </a>
                </li>
                <li>
                  Foto’s door{" "}
                  <a
                    href="https://www.feetinthedirtheadintheclouds.com/"
                    target={"_blank"}
                    rel={"noreferrer"}
                  >
                    Ilse Wolf
                  </a>
                </li>
              </ul>
            </div>

            <div className={"md:text-right"}>
              <h5>Contact</h5>

              <h3>
                <a href="mailto:info@ecstaticdance.nl">info@ecstaticdance.nl</a>
              </h3>
            </div>
          </div>
          <div
            className={
              "sm:hidden flex gap-5 items-end justify-between px-4 md:mt-5 mt-8"
            }
          >
            <img className={"h-20"} src={basepath + "/dancer4.svg"} alt="" />{" "}
            <img className={"h-20"} src={basepath + "/dancer3.svg"} alt="" />{" "}
            <img
              className={"h-20 -scale-x-100"}
              src={basepath + "/dancer1.svg"}
              alt=""
            />{" "}
          </div>
        </div>
      </footer>
    </>
  );
}
