import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { Row, Col, Button, Form as BootstrapForm } from 'react-bootstrap'
import * as Yup from 'yup'
import { useNavigate, useParams } from 'react-router-dom'

const MyForm = ({ action }) => {
  const { id } = useParams()
  const list = JSON.parse(localStorage.getItem('list')) || []
  let editForm, editIndex;

  for (let i = 0; i < list.length; i++) {
    if (list[i].fid === id) {
      editForm = list[i];
      editIndex = i;
      break;
    }
  }

  const [countries, setCountries] = useState([])
  const [provinces, setProvinces] = useState([])

  useEffect(() => {
    fetch('../data/countries.json')
      .then(res => res.json())
      .then(res => {
        setCountries(res)
      })
  }, [])

  useEffect(() => {
    fetch('../data/vietnam-province-district.json')
      .then(res => res.json())
      .then(res => {
        setProvinces(Object.values(res))
      })
  }, [])

  const [selectedProvince, setSelectedProvince] = useState(id ? editForm.province : '')
  const [districts, setDistricts] = useState([])

  useEffect(() => {
    (provinces.length > 0 && selectedProvince.length > 0) && setDistricts(Object.values(provinces.find(p => p.name === selectedProvince).cities));
    selectedProvince.length === 0 && setDistricts([])
  }, [selectedProvince, provinces])

  const defaultSymptoms = ['Fiber', 'Fever', 'Sore throat', 'Difficulty of breathing']
  const defaultVaccines = ['None', 'Astra Zenecca', 'Pfizer', 'Moderna', 'Sinopharm']
  const navigate = useNavigate();

  const { v4: uuidv4 } = require('uuid');
  function generateUniqueID() {
    return '_' + uuidv4().substring(0, 5);
  }

  function convertDateFormat(inputDate) {
    var datePart = inputDate.split("-");
    return datePart[1] + '/' + datePart[2] + '/' + datePart[0];
  }

  const initialValues = {
    fullName: id ? editForm.fullName : '',
    object: id ? editForm.object : '',
    dateOfBirth: id ? editForm.dateOfBirth : '',
    gender: id ? editForm.gender : '',
    nationality: id ? editForm.nationality : '',
    id: id ? editForm.id : '',
    travels: id ? editForm.travels : [],
    province: id ? editForm.province : '',
    district: id ? editForm.district : '',
    address: id ? editForm.address : '',
    email: id ? editForm.email : '',
    mobile: id ? editForm.mobile : '',
    symptoms: id ? editForm.symptoms : [],
    vaccines: id ? editForm.vaccines : '',
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Name is required'),
    object: Yup.string().required('Object is required'),
    dateOfBirth: Yup.string().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required'),
    nationality: Yup.string().required('Nationality is required'),
    id: Yup.string().required('Nation ID or Passport ID is required'),
    travels: Yup.array()
      .of(
        Yup.object().shape({
          departureDes: Yup.string().required('Departure Description is required'),
          destination: Yup.string().required('Destination is required')
        })
      ),
    province: Yup.string().required('Contact province is required'),
    district: Yup.string().required('Contact district is required'),
    address: Yup.string().required('Address is required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    mobile: Yup.number().typeError('Mobile is invalid').required('Mobile is required')
  });

  return (
    <>
      <Row className='pt-4 mb-3'>
        <Col lg={12}>
          <h2 className='fs-2 text-center text-success'>
            MEDICAL DECLARATION FORM FOR FOREIGN ENTRY
          </h2>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={values => {
                if (action === 'add') {
                  list.push({ fid: generateUniqueID(), dateOfBirth: convertDateFormat(values.dateOfBirth), ...values })
                } else {
                  list[editIndex] = { fid: id, ...values }
                }
                localStorage.setItem('list', JSON.stringify(list))
                navigate('/table')
              }}
            >
              {formik => (
                <Form as={BootstrapForm} onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col lg={12}>
                      <h4 className="fs-5 fw-bold">Personal information:</h4>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col lg={12}>
                      <div>
                        <BootstrapForm.Group controlId='fullName'>
                          <BootstrapForm.Label>Full name<span className="text-danger">*</span></BootstrapForm.Label>
                          <Field as={BootstrapForm.Control}
                            className={formik.touched.fullName && formik.errors.fullName && 'input-error'}
                            name="fullName"
                            type="text"
                            placeholder="Full name..." />
                          <ErrorMessage name="fullName" component="div" className='error' />
                        </BootstrapForm.Group>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col lg={6}>
                      <div>
                        <BootstrapForm.Group controlId='object'>
                          <BootstrapForm.Label>Object<span className="text-danger">*</span></BootstrapForm.Label>
                          <Field as="select"
                            name="object"
                            className={(formik.touched.object && formik.errors.object) ? 'input-error form-select' : 'form-select'}>
                            <option value="">-----Choose</option>
                            <option value="Expert">Expert</option>
                            <option value="Vietnamese">Vietnamese</option>
                            <option value="International student">International Student</option>
                            <option value="Other">Other</option>
                          </Field>
                          <ErrorMessage name="object" component="div" className='error' />
                        </BootstrapForm.Group>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div>
                        <BootstrapForm.Group controlId='dateOfBirth'>
                          <BootstrapForm.Label>Date of birth</BootstrapForm.Label>
                          <Field as={BootstrapForm.Control}
                            className={(formik.touched.dateOfBirth && formik.errors.dateOfBirth) ? 'input-error' : ''}
                            type="date"
                            name="dateOfBirth" />
                          <ErrorMessage name="dateOfBirth" component="div" className='error' />
                        </BootstrapForm.Group>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div>
                        <BootstrapForm.Group controlId='gender'>
                          <BootstrapForm.Label>Gender<span className="text-danger">*</span></BootstrapForm.Label>
                          <Field as="select"
                            name="gender"
                            className={(formik.touched.gender && formik.errors.gender) ? 'input-error form-select' : 'form-select'}>
                            <option value="">-----Choose</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Field>
                          <ErrorMessage name="gender" component="div" className='error' />
                        </BootstrapForm.Group>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col lg={6}>
                      <div>
                        <BootstrapForm.Group controlId='nationality'>
                          <BootstrapForm.Label>Nationality<span className="text-danger">*</span></BootstrapForm.Label>
                          <Field as="select"
                            name="nationality"
                            className={(formik.touched.nationality && formik.errors.nationality) ? 'input-error form-select' : 'form-select'}>
                            <option value="">-----Choose</option>
                            {countries.map((c, i) => {
                              return (
                                <option key={i} value={c.name}>{c.name}</option>
                              )
                            })}
                          </Field>
                          <ErrorMessage name="nationality" component="div" className='error' />
                        </BootstrapForm.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div>
                        <BootstrapForm.Group controlId='id'>
                          <BootstrapForm.Label>Nation ID or Passport ID<span className="text-danger">*</span></BootstrapForm.Label>
                          <Field as={BootstrapForm.Control}
                            className={formik.touched.id && formik.errors.id && 'input-error'}
                            name="id"
                            type="text"
                            placeholder="Nation ID or Passport ID..." />
                          <ErrorMessage name="id" component="div" className='error' />
                        </BootstrapForm.Group>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <h4 className="fs-5 fw-bold">Travel:</h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <FieldArray name='travels'>
                        {({ remove, push }) => (
                          <>
                            {formik.values.travels.length > 0
                              ? <>
                                {formik.values.travels.map((t, i) =>
                                  <Row key={i} className="mt-1 mb-4">
                                    <Col lg={12}>
                                      <h6 className="fw-bold text-primary">Travel {i + 1}</h6>
                                    </Col>
                                    <Col className="mb-4" lg={6}>
                                      <div>
                                        <BootstrapForm.Group controlId={`travels[${i}].departureDate`}>
                                          <BootstrapForm.Label>Departure Date</BootstrapForm.Label>
                                          <Field as={BootstrapForm.Control}
                                            name={`travels[${i}].departureDate`}
                                            type="date" />
                                        </BootstrapForm.Group>
                                      </div>
                                    </Col>
                                    <Col className="mb-4" lg={6}>
                                      <div>
                                        <BootstrapForm.Group controlId={`travels[${i}].immigrationDate`}>
                                          <BootstrapForm.Label>Immigration Date</BootstrapForm.Label>
                                          <Field as={BootstrapForm.Control}
                                            name={`travels[${i}].immigrationDate`}
                                            type="date" />
                                        </BootstrapForm.Group>
                                      </div>
                                    </Col>
                                    <Col lg={6}>
                                      <div>
                                        <BootstrapForm.Group controlId={`travels[${i}].departureDes`}>
                                          <BootstrapForm.Label>Departure<span className="text-danger">*</span></BootstrapForm.Label>
                                          <Field as="select"
                                            name={`travels[${i}].departureDes`}
                                            className={
                                              formik.touched.travels && formik.touched.travels[i] && formik.touched.travels[i].departureDes &&
                                                formik.errors.travels && formik.errors.travels[i] && formik.errors.travels[i].departureDes
                                                ? 'input-error form-select'
                                                : 'form-select'
                                            }
                                          >
                                            <option value="">-----Choose</option>
                                            {countries.map((c, i) => {
                                              return (
                                                <option key={i} value={c.name}>{c.name}</option>
                                              )
                                            })}
                                          </Field>
                                          <ErrorMessage name={`travels[${i}].departureDes`} component="div" className='error' />
                                        </BootstrapForm.Group>
                                      </div>
                                    </Col>
                                    <Col lg={6}>
                                      <div>
                                        <BootstrapForm.Group controlId={`travels[${i}].destination`}>
                                          <BootstrapForm.Label>Destination<span className="text-danger">*</span></BootstrapForm.Label>
                                          <Field as="select"
                                            name={`travels[${i}].destination`}
                                            className={
                                              formik.touched.travels && formik.touched.travels[i] && formik.touched.travels[i].destination &&
                                                formik.errors.travels && formik.errors.travels[i] && formik.errors.travels[i].destination
                                                ? 'input-error form-select'
                                                : 'form-select'
                                            }
                                          >
                                            <option value="">-----Choose</option>
                                            {countries.map((c, i) => {
                                              return (
                                                <option key={i} value={c.name}>{c.name}</option>
                                              )
                                            })}
                                          </Field>
                                          <ErrorMessage name={`travels[${i}].destination`} component="div" className='error' />
                                        </BootstrapForm.Group>
                                      </div>
                                    </Col>
                                    <Col lg={12} className='mt-4'>
                                      <Button variant='warning'
                                        className='me-3'
                                        onClick={() => push({
                                          departureDate: '',
                                          immigrationDate: '',
                                          departureDes: '',
                                          destination: ''
                                        })}>Add more
                                      </Button>
                                      <Button variant='danger'
                                        onClick={() => {
                                          const travelEntry = formik.values.travels[i];
                                          if (travelEntry.departureDate || travelEntry.immigrationDate || travelEntry.departureDes || travelEntry.destination) {
                                            window.confirm(`Do you want to remove travel record ${i + 1}?`) && remove(i)
                                          } else {
                                            remove(i);
                                          }
                                        }}>
                                        Delete
                                      </Button>
                                    </Col>
                                  </Row>
                                )}
                              </>
                              : <>
                                <div className='d-flex align-items-center gap-4'>
                                  <h6>Do you travel in the last 14 days ?</h6>
                                  <Button variant='warning'
                                    onClick={() => push({
                                      departureDate: '',
                                      immigrationDate: '',
                                      departureDes: '',
                                      destination: ''
                                    })}>Add more</Button>
                                </div>
                              </>}
                          </>
                        )}
                      </FieldArray>
                    </Col>
                  </Row>
                  <Row className='mt-4'>
                    <Col lg={12}>
                      <h4 className="fs-5 fw-bold">
                        Contact:
                      </h4>
                    </Col>
                  </Row>
                  <Row className='mb-4'>
                    <Col lg={6}>
                      <div>
                        <BootstrapForm.Group controlId='province'>
                          <BootstrapForm.Label>Province<span className="text-danger">*</span></BootstrapForm.Label>
                          <Field as="select"
                            name="province"
                            className={(formik.touched.province && formik.errors.province) ? 'input-error form-select' : 'form-select'}
                            onChange={(e) => {
                              formik.handleChange(e);
                              setSelectedProvince(e.target.value)
                            }}>
                            <option value="">-----Choose</option>
                            {provinces.map(p => p.name).map((p, i) => {
                              return (
                                <option key={i} value={p}>{p}</option>
                              )
                            })}
                          </Field>
                          <ErrorMessage name="province" component="div" className='error' />
                        </BootstrapForm.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div>
                        <BootstrapForm.Group controlId='district'>
                          <BootstrapForm.Label>District<span className="text-danger">*</span></BootstrapForm.Label>
                          <Field as="select"
                            name="district"
                            className={(formik.touched.district && formik.errors.district) ? 'input-error form-select' : 'form-select'}>
                            <option value="">-----Choose</option>
                            {districts.map((d, i) => (
                              <option key={i} value={d}>{d}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="district" component="div" className='error' />
                        </BootstrapForm.Group>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col lg={6}>
                      <div>
                        <BootstrapForm.Group controlId='address'>
                          <BootstrapForm.Label>Address<span className="text-danger">*</span></BootstrapForm.Label>
                          <Field as={BootstrapForm.Control}
                            className={formik.touched.address && formik.errors.address && 'input-error'}
                            name="address"
                            type="text"
                            placeholder="Address..." />
                          <ErrorMessage name="address" component="div" className='error' />
                        </BootstrapForm.Group>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div>
                        <BootstrapForm.Group controlId='email'>
                          <BootstrapForm.Label>Email<span className="text-danger">*</span></BootstrapForm.Label>
                          <Field as={BootstrapForm.Control}
                            className={formik.touched.email && formik.errors.email && 'input-error'}
                            name="email"
                            type="text"
                            placeholder="Email..." />
                          <ErrorMessage name="email" component="div" className='error' />
                        </BootstrapForm.Group>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div>
                        <BootstrapForm.Group controlId='mobile'>
                          <BootstrapForm.Label>Mobile<span className="text-danger">*</span></BootstrapForm.Label>
                          <Field as={BootstrapForm.Control}
                            className={formik.touched.mobile && formik.errors.mobile && 'input-error'}
                            name="mobile"
                            type="text"
                            placeholder="Mobile..." />
                          <ErrorMessage name="mobile" component="div" className='error' />
                        </BootstrapForm.Group>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12}>
                      <h4 className="fs-5 fw-bold">
                        Symptoms:
                      </h4>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <BootstrapForm.Group controlId='symptoms'>
                      <Col lg={10}>
                        <Row>
                          <Col lg={4}>
                            <BootstrapForm.Label className='me-4 d-inline-block'>Do you have any following symptoms?:</BootstrapForm.Label>
                          </Col>
                          <Col>
                            {defaultSymptoms.map((s, i) => (
                              <BootstrapForm.Check.Label className='me-4' key={i}>
                                <Field as={BootstrapForm.Check.Input} className='me-1' name='symptoms' type="checkbox" value={s} />
                                {s}
                              </BootstrapForm.Check.Label>
                            ))}
                          </Col>
                        </Row>
                      </Col>
                    </BootstrapForm.Group>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12}>
                      <h4 className="fs-5 fw-bold">
                        Vaccines:
                      </h4>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <BootstrapForm.Group controlId='vaccines'>
                      <Col lg={10}>
                        <Row>
                          <Col lg={4}>
                            <BootstrapForm.Label className='me-4 d-inline-block'>Which one would you like to vaccinate ?:</BootstrapForm.Label>
                          </Col>
                          <Col>
                            {defaultVaccines.map((v, i) => (
                              <BootstrapForm.Check.Label className='me-4' key={i}>
                                <Field as={BootstrapForm.Check.Input} className='me-1' name='vaccines' type="radio" value={v === 'None' ? '' : v} />
                                {v}
                              </BootstrapForm.Check.Label>
                            ))}
                          </Col>
                        </Row>
                      </Col>
                    </BootstrapForm.Group>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div className='d-flex align-items-center gap-3'>
                        <Button variant='success' type='submit' size='lg'>
                          Submit
                        </Button>
                        <Button variant='danger' size='lg' onClick={() => {
                          if (formik.dirty) {
                            window.confirm('Do you want to cancel') && navigate('/table')
                          } else {
                            navigate('/table');
                          }
                        }}>
                          Cancel
                        </Button>
                        <Button variant='secondary' size='lg' onClick={() => {
                          if (formik.dirty) {
                            window.confirm('Do you want to reset') && formik.resetForm();
                          } else {
                            formik.resetForm();
                          }
                        }}>
                          Reset
                        </Button>

                      </div>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default MyForm